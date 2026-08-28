<script lang="ts">
	import I18nKey from "@i18n/i18nKey";
	import { i18n } from "@i18n/translation";
	import Icon from "@iconify/svelte";
	import {
		applyDisplaySettings,
		applyRadius,
		applyWidgetVisibility,
		DEFAULT_RADIUS,
		getDefaultHue,
		getDefaultSaturation,
		getDisplaySettings,
		getHue,
		getSaturation,
		saveDisplaySettings,
		setHue,
		setSaturation,
	} from "@utils/setting-utils";
	import { onMount } from "svelte";

	import type { DisplaySettingsProps } from "./types";

	export let className = "";
	export let sidebarLeft: string[] = [];
	export let sidebarRight: string[] = [];

	// 侧栏组件类型 → i18n 名称
	const WIDGET_LABELS: Record<string, I18nKey> = {
		profile: I18nKey.widgetProfile,
		announcement: I18nKey.widgetAnnouncement,
		tags: I18nKey.widgetTags,
		toc: I18nKey.widgetCardToc,
		"card-toc": I18nKey.widgetCardToc,
		"site-stats": I18nKey.widgetSiteStats,
		calendar: I18nKey.widgetCalendar,
		categories: I18nKey.widgetCategories,
		"music-player": I18nKey.widgetMusic,
		"music-sidebar": I18nKey.widgetMusic,
	};

	let hue = 250;
let defaultHue = 250;
let saturation = 1;
let defaultSaturation = 1;
let radius = DEFAULT_RADIUS;
let hiddenWidgets: string[] = [];
let isMounted = false;

function resetHue() {
	hue = defaultHue;
}

function resetSaturation() {
	saturation = defaultSaturation;
}

	function resetRadius() {
		radius = DEFAULT_RADIUS;
	}

	function resetWidgets() {
		hiddenWidgets = [];
	}

	function toggleWidget(type: string, event: Event) {
		const checked = (event.currentTarget as HTMLInputElement).checked;
		hiddenWidgets = checked
			? hiddenWidgets.filter((t) => t !== type)
			: [...hiddenWidgets, type];
	}

	function widgetLabel(type: string): string {
		const key = WIDGET_LABELS[type];
		return key ? i18n(key) : type;
	}

	onMount(() => {
		isMounted = true;
		defaultHue = getDefaultHue();
		hue = getHue();
		defaultSaturation = getDefaultSaturation();
		saturation = getSaturation();

		const settings = getDisplaySettings();
		radius = settings.radius;
		hiddenWidgets = settings.hiddenWidgets;

		// 初始应用（swup 首次进入时侧栏 DOM 可能晚于本组件挂载，直接应用）
		applyDisplaySettings();

		// swup 导航替换侧栏 DOM 后重新应用
		const reapply = () => applyDisplaySettings();
		if (window.swup?.hooks) {
			window.swup.hooks.on("content:replace", reapply);
		} else {
			document.addEventListener(
				"swup:enable",
				() => {
					window.swup?.hooks?.on("content:replace", reapply);
				},
				{ once: true },
			);
		}
	});

	$: if (isMounted && (hue || hue === 0)) {
		setHue(hue);
	}

	$: if (isMounted) {
		setSaturation(saturation);
	}

	$: if (isMounted) {
		applyRadius(radius);
		saveDisplaySettings({ radius, hiddenWidgets });
	}

	$: if (isMounted) {
		applyWidgetVisibility(hiddenWidgets);
	}
</script>

<div
	id="display-setting"
	class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4 max-h-[75vh] overflow-y-auto"
	class:list={[className]}
>
	<!-- 主题色 -->
	<div class="flex flex-row gap-2 mb-3 items-center justify-between">
		<div
			class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
		>
			{i18n(I18nKey.themeColor)}
			<button
				aria-label="Reset to Default"
				class="btn-regular w-7 h-7 rounded-md active:scale-90"
				class:opacity-0={hue === defaultHue}
				class:pointer-events-none={hue === defaultHue}
				on:click={resetHue}
			>
				<div class="text-[var(--btn-content)]">
					<Icon
						icon="fa7-solid:arrow-rotate-left"
						class="text-[0.875rem]"
					></Icon>
				</div>
			</button>
		</div>
		<div class="flex gap-1">
			<div
				id="hueValue"
				class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]"
			>
				{hue}
			</div>
		</div>
	</div>
	<div
		class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none"
	>
		<input
			aria-label={i18n(I18nKey.themeColor)}
			type="range"
			min="0"
			max="360"
			bind:value={hue}
			class="slider"
			id="colorSlider"
			step="5"
			style="width: 100%"
		/>
	</div>

	<!-- 饱和度 -->
	<div class="flex flex-row gap-2 mb-3 mt-5 items-center justify-between">
		<div
			class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
		>
			{i18n(I18nKey.settingsSaturation)}
			<button
				aria-label="Reset to Default"
				class="btn-regular w-7 h-7 rounded-md active:scale-90"
				class:opacity-0={saturation === defaultSaturation}
				class:pointer-events-none={saturation === defaultSaturation}
				on:click={resetSaturation}
			>
				<div class="text-[var(--btn-content)]">
					<Icon
						icon="fa7-solid:arrow-rotate-left"
						class="text-[0.875rem]"
					></Icon>
				</div>
			</button>
		</div>
		<div class="flex gap-1">
			<div
				class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]"
			>
				{Math.round(saturation * 100)}
			</div>
		</div>
	</div>
	<div
		class="w-full h-6 px-1 bg-[var(--btn-regular-bg)] rounded select-none"
	>
		<input
			aria-label={i18n(I18nKey.settingsSaturation)}
			type="range"
			min="0"
			max="1"
			step="0.05"
			bind:value={saturation}
			class="slider"
			style="width: 100%"
		/>
	</div>

	<!-- 圆角大小 -->
	<div class="flex flex-row gap-2 mb-3 mt-5 items-center justify-between">
		<div
			class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
		>
			{i18n(I18nKey.settingsRadius)}
			<button
				aria-label="Reset to Default"
				class="btn-regular w-7 h-7 rounded-md active:scale-90"
				class:opacity-0={radius === DEFAULT_RADIUS}
				class:pointer-events-none={radius === DEFAULT_RADIUS}
				on:click={resetRadius}
			>
				<div class="text-[var(--btn-content)]">
					<Icon
						icon="fa7-solid:arrow-rotate-left"
						class="text-[0.875rem]"
					></Icon>
				</div>
			</button>
		</div>
		<div
			class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]"
		>
			{radius}
		</div>
	</div>
	<div
		class="w-full h-6 px-1 bg-[var(--btn-regular-bg)] rounded select-none"
	>
		<input
			aria-label={i18n(I18nKey.settingsRadius)}
			type="range"
			min="0"
			max="24"
			step="2"
			bind:value={radius}
			class="slider"
			style="width: 100%"
		/>
	</div>

	<!-- 侧栏组件 -->
	<div class="flex flex-row gap-2 mb-3 mt-5 items-center justify-between">
		<div
			class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
		>
			{i18n(I18nKey.settingsSidebarWidgets)}
			<button
				aria-label="Reset to Default"
				class="btn-regular w-7 h-7 rounded-md active:scale-90"
				class:opacity-0={hiddenWidgets.length === 0}
				class:pointer-events-none={hiddenWidgets.length === 0}
				on:click={resetWidgets}
			>
				<div class="text-[var(--btn-content)]">
					<Icon
						icon="fa7-solid:arrow-rotate-left"
						class="text-[0.875rem]"
					></Icon>
				</div>
			</button>
		</div>
	</div>
	<div class="flex flex-col gap-2 px-1">
		{#if sidebarLeft.length > 0}
			<div class="text-sm text-black/45 dark:text-white/50 px-2">
				{i18n(I18nKey.settingsLeftSidebar)}
			</div>
			<div class="grid grid-cols-2 gap-x-2 gap-y-1.5">
				{#each sidebarLeft as type (type)}
					<label
						class="flex items-center gap-2 text-sm text-black/75 dark:text-white/75 cursor-pointer select-none"
					>
						<input
							type="checkbox"
							class="accent-[var(--primary)] w-4 h-4"
							checked={!hiddenWidgets.includes(type)}
							on:change={(event) => toggleWidget(type, event)}
						/>
						{widgetLabel(type)}
					</label>
				{/each}
			</div>
		{/if}
		{#if sidebarRight.length > 0}
			<div class="text-sm text-black/45 dark:text-white/50 px-2 mt-1">
				{i18n(I18nKey.settingsRightSidebar)}
			</div>
			<div class="grid grid-cols-2 gap-x-2 gap-y-1.5">
				{#each sidebarRight as type (type)}
					<label
						class="flex items-center gap-2 text-sm text-black/75 dark:text-white/75 cursor-pointer select-none"
					>
						<input
							type="checkbox"
							class="accent-[var(--primary)] w-4 h-4"
							checked={!hiddenWidgets.includes(type)}
							on:change={(event) => toggleWidget(type, event)}
						/>
						{widgetLabel(type)}
					</label>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="stylus">
    #display-setting
      /* 主题色滑块：彩虹渐变背景 */
      #colorSlider
        -webkit-appearance none
        height 1.5rem
        background-image var(--color-selection-bar)
        transition background-image 0.15s ease-in-out

        /* Input Thumb */
        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-moz-range-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          border-width 0
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-ms-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

      /* 圆角滑块：thumb 通用样式 */
      input[type="range"]
        -webkit-appearance none
        height 1.5rem

        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-moz-range-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          border-width 0
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)
</style>
