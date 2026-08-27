import type { WALLPAPER_MODE } from "@/types/config";

export type { WALLPAPER_MODE };

export interface DisplaySettingsProps {
	class?: string;
	/** 左侧栏组件类型列表（来自 sidebarLayoutConfig.components.left） */
	sidebarLeft?: string[];
	/** 右侧栏组件类型列表（来自 sidebarLayoutConfig.components.right） */
	sidebarRight?: string[];
}

export interface WallpaperSwitchProps {
	mode?: WALLPAPER_MODE;
}
