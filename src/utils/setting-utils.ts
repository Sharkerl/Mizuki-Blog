import {
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
	// WALLPAPER_BANNER,
} from "@constants/constants";

import { siteConfig } from "@/config";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	// 在Swup页面切换时，config-carrier可能不存在，使用默认值
	if (!configCarrier) {
		return Number.parseInt(fallback);
	}
	return Number.parseInt(configCarrier.dataset.hue || fallback);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

/** 获取默认饱和度（config-carrier 的 data-saturation，缺省 1） */
export function getDefaultSaturation(): number {
	const configCarrier = document.getElementById("config-carrier");
	if (!configCarrier) {
		return 1;
	}
	const value = Number.parseFloat(configCarrier.dataset.saturation || "1");
	return Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 1;
}

/** 获取当前饱和度（localStorage 优先，回退配置默认值） */
export function getSaturation(): number {
	const stored = localStorage.getItem("saturation");
	if (stored !== null) {
		const value = Number.parseFloat(stored);
		if (Number.isFinite(value)) {
			return Math.min(Math.max(value, 0), 1);
		}
	}
	return getDefaultSaturation();
}

/** 设置饱和度并实时应用到 :root 的 --sat 变量 */
export function setSaturation(saturation: number): void {
	const value = Math.min(Math.max(saturation, 0), 1);
	localStorage.setItem("saturation", String(value));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--sat", String(value));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	// 获取当前主题状态的完整信息
	const currentIsDark = document.documentElement.classList.contains("dark");
	const currentTheme = document.documentElement.getAttribute("data-theme");

	// 计算目标主题状态
	let targetIsDark = false; // 初始化默认值
	switch (theme) {
		case LIGHT_MODE:
			targetIsDark = false;
			break;
		case DARK_MODE:
			targetIsDark = true;
			break;
		default:
			// 处理默认情况，使用当前主题状态
			targetIsDark = currentIsDark;
			break;
	}

	// 检测是否真的需要主题切换：
	// 1. dark类状态是否改变
	// 2. expressiveCode主题是否需要更新
	const needsThemeChange = currentIsDark !== targetIsDark;
	const expectedTheme = targetIsDark ? "github-dark" : "github-light";
	const needsCodeThemeUpdate = currentTheme !== expectedTheme;

	// 如果既不需要主题切换也不需要代码主题更新，直接返回
	if (!needsThemeChange && !needsCodeThemeUpdate) {
		return;
	}

	// 定义实际执行主题切换的函数
	const performThemeChange = () => {
		// 应用主题变化
		if (needsThemeChange) {
			if (targetIsDark) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}

		// Set the theme for Expressive Code based on current mode
		// 只在必要时更新 data-theme 属性以减少重绘
		if (needsCodeThemeUpdate) {
			const expressiveTheme = targetIsDark
				? "github-dark"
				: "github-light";
			document.documentElement.setAttribute(
				"data-theme",
				expressiveTheme,
			);
		}
	};

	// 检查浏览器是否支持 View Transitions API
	if (
		needsThemeChange &&
		document.startViewTransition &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches
	) {
		// 添加标记类，表示正在使用 View Transitions
		document.documentElement.classList.add(
			"is-theme-transitioning",
			"use-view-transition",
		);

		// 使用 View Transitions API 实现平滑过渡
		const transition = document.startViewTransition(() => {
			performThemeChange();
		});

		// 在过渡完成后移除标记类（使用 finished promise 确保完全同步）
		transition.finished
			.then(() => {
				// 使用 microtask 确保在下一个事件循环前完成清理
				queueMicrotask(() => {
					document.documentElement.classList.remove(
						"is-theme-transitioning",
						"use-view-transition",
					);
				});
			})
			.catch(() => {
				// 如果过渡被中断，也要清理状态
				document.documentElement.classList.remove(
					"is-theme-transitioning",
					"use-view-transition",
				);
			});
	} else {
		// 不支持 View Transitions API 或用户偏好减少动画，使用传统方式
		// 只在需要主题切换时添加过渡保护
		if (needsThemeChange) {
			document.documentElement.classList.add("is-theme-transitioning");
		}

		performThemeChange();

		// 使用 requestAnimationFrame 确保在下一帧移除过渡保护类
		if (needsThemeChange) {
			requestAnimationFrame(() => {
				document.documentElement.classList.remove(
					"is-theme-transitioning",
				);
			});
		}
	}
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}

export function getStoredWallpaperMode(): WALLPAPER_MODE {
	return (
		(localStorage.getItem("wallpaperMode") as WALLPAPER_MODE) ||
		siteConfig.wallpaperMode.defaultMode
	);
}

export function setWallpaperMode(mode: WALLPAPER_MODE): void {
	localStorage.setItem("wallpaperMode", mode);
	// 触发自定义事件通知其他组件壁纸模式已改变
	window.dispatchEvent(
		new CustomEvent("wallpaper-mode-change", { detail: { mode } }),
	);
}

/* ========== 显示设置（运行时覆盖） ========== */

const DISPLAY_SETTINGS_KEY = "mizuki:display-settings";
/** 默认圆角（px），对应 variables.styl 中的 --radius-large: 1rem */
export const DEFAULT_RADIUS = 16;

export interface DisplaySettings {
	/** 圆角大小（px） */
	radius: number;
	/** 隐藏的侧栏组件类型列表 */
	hiddenWidgets: string[];
}

function readDisplaySettings(): DisplaySettings {
	try {
		const raw = localStorage.getItem(DISPLAY_SETTINGS_KEY);
		if (!raw) {
			return { radius: DEFAULT_RADIUS, hiddenWidgets: [] };
		}
		const parsed = JSON.parse(raw) as Partial<DisplaySettings>;
		return {
			radius:
				typeof parsed.radius === "number" ? parsed.radius : DEFAULT_RADIUS,
			hiddenWidgets: Array.isArray(parsed.hiddenWidgets)
				? parsed.hiddenWidgets.filter((v) => typeof v === "string")
				: [],
		};
	} catch {
		return { radius: DEFAULT_RADIUS, hiddenWidgets: [] };
	}
}

export function getDisplaySettings(): DisplaySettings {
	return readDisplaySettings();
}

export function saveDisplaySettings(settings: DisplaySettings): void {
	localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(settings));
}

/** 应用圆角到 :root 的 --radius-large（内联样式覆盖构建时默认值） */
export function applyRadius(radius: number): void {
	const root = document.querySelector(":root") as HTMLElement | null;
	if (!root) {
		return;
	}
	if (radius === DEFAULT_RADIUS) {
		root.style.removeProperty("--radius-large");
	} else {
		root.style.setProperty("--radius-large", `${radius}px`);
	}
}

/** 按隐藏列表设置侧栏组件 wrapper 的 data-hidden 属性 */
export function applyWidgetVisibility(hiddenWidgets: string[]): void {
	const hidden = new Set(hiddenWidgets);
	document.querySelectorAll<HTMLElement>("[data-widget-type]").forEach((el) => {
		if (hidden.has(el.dataset.widgetType as string)) {
			el.setAttribute("data-hidden", "true");
		} else {
			el.removeAttribute("data-hidden");
		}
	});
}

/** 应用全部显示设置（初始加载与 swup 导航后调用） */
export function applyDisplaySettings(): void {
	const settings = readDisplaySettings();
	applyRadius(settings.radius);
	applyWidgetVisibility(settings.hiddenWidgets);
}
