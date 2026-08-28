# 个人定制改动记录

本文档记录在 Mizuki 原版基础上所做的个人定制改动，方便后续维护和主题更新时合并。

---

## 1. 地图足迹页（Footprint / `/map/`）

### 功能
基于 Leaflet 的文章位置地图，读取文章 frontmatter 的 `location` 字段（格式 `"纬度,经度"`），在地图上打标记，点击弹出文章列表。

### 涉及文件

| 文件 | 说明 |
|------|------|
| `src/pages/map.astro` | 页面入口：解析 location → 传给 Map 组件，含 featurePages.footprint 404 守卫 |
| `src/components/features/map/Map.astro` | 核心组件：服务端按经纬度分组，弹窗内容服务端渲染到 `<template>`，客户端初始化 Leaflet |
| `src/components/features/map/MapPopup.astro` | 弹窗（单篇/多篇列表），使用 `Link` 原子组件 |
| `src/components/features/map/MapPopupItem.astro` | 弹窗列表项 |
| `src/components/features/map/MapZoomControls.astro` | 右上角缩放按钮（`btn-card` + `Icon`：zoom-in / zoom-out / filter-center-focus） |
| `src/components/features/map/types.ts` | `MapPost` / `MapGroup` 类型 |
| `src/styles/map.css` | 地图全局样式（弹窗外壳、标记圆点、暗色适配，由 map.astro 引入） |
| `src/utils/content-utils.ts` | `parseLocation()` 解析并校验经纬度 |
| `src/content.config.ts` | posts schema 中的 `location` 字段 |

### 可配置项（`src/config.ts` 的 `MapConfig`）

```ts
export const MapConfig = {
	defaultCenter: {
		lat: 32.0415, // 纬度
		lng: 118.7674, // 经度（东经为正）
		zoom: 9, // 默认缩放级别，超出 minZoom-maxZoom 会被自动钳制
	},
	minZoom: 4, // 最小缩放级别
	maxZoom: 9, // 最大缩放级别
};
```

- 初始视野和"重置视野"按钮都由 `defaultCenter` 驱动
- 地图最大边界硬编码为中国+日本（`[[16, 72], [56, 152]]`），如需扩大改 `Map.astro` 中的 `setMaxBounds`

### 实现要点（维护时注意）

- **瓦片**：本地自托管 `/tiles/`（来源仓库 [Sharkerl/Leaflet-Tiles-Storage](https://github.com/Sharkerl/Leaflet-Tiles-Storage)），z4-6 广域覆盖中国+日本，z7-9 仅东部中国细节；其他区域放大到 z7+ 会显示灰底，属正常
- **Leaflet 加载**：`/vendor/leaflet/` 本地文件，JS 中仿照 Twikoo 组件的"带 id 防重注入 + Promise 加载"方式动态注入，兼容 swup 页面切换
- **样式为什么放全局 map.css**：弹窗和标记 DOM 是 Leaflet 运行时创建的，Astro 作用域样式（cid 选择器）对它们无效；覆盖 Leaflet 默认样式用复合选择器提高优先级，不使用 `!important`（遵守 CSS 规范）
- **swup 清理**：地图实例存于 `window.__mizukiFootprintMap`，swup `content:replace` 时若容器已移除则 `map.remove()`，防止 resize 监听泄漏
- **滚轮缩放**：默认禁用（防滚动页面被卡），点击地图后启用，鼠标移出后禁用
- **弹窗复用组件**：弹窗 HTML 在服务端渲染进 `<template id="map-popup-tpl-{i}">`，客户端克隆节点绑定到 marker，因此能使用 `Link` / `MapPopup` 等组件且样式生效
- **i18n 键**：`footprint` / `footprintSubtitle` / `footprintEmpty` / `footprintViewPost` / `footprintPostsAtLocation` / `footprintZoomIn` / `footprintZoomOut` / `footprintResetView`
- **导航本地化**：菜单项名 `Footprint`（或 `Footprints`）映射到 `I18nKey.footprint`，见 DropdownMenu.astro / NavMenuPanel.astro 的 `navTitleMap`

---

## 2. 运行时设置面板扩展（右上角调色板按钮）

### 功能
在原有"主题色"设置面板中新增两组客户端配置，localStorage 持久化（key：`mizuki:display-settings`），刷新保留：

1. **圆角大小**：滑块 0-24px，实时修改 `:root` 的 `--radius-large`，全站卡片圆角即时变化
2. **侧栏组件显隐**：左/右侧栏每个组件的开关，实时显示/隐藏

### 涉及文件

| 文件 | 说明 |
|------|------|
| `src/components/features/settings/DisplaySettings.svelte` | 面板本体（主题色 + 圆角 + 侧栏组件三组） |
| `src/components/features/settings/types.ts` | Props 类型（sidebarLeft / sidebarRight） |
| `src/utils/setting-utils.ts` | 新增 `DisplaySettings` 读写与 `applyRadius` / `applyWidgetVisibility` / `applyDisplaySettings` |
| `src/components/layout/SidebarColumn.astro` | 每个侧栏组件包一层 `widget-display-wrapper`（`display: contents`，不影响布局），带 `data-widget-type` 供显隐控制 |
| `src/components/organisms/navigation/Navbar.astro` | 传入 `sidebarLayoutConfig.components.left/right` 组件列表 |

### 实现要点

- wrapper 用 `display: contents`，不改变侧栏 flex 布局；`data-hidden="true"` 时 `display: none`
- swup 导航替换侧栏 DOM 后自动重新应用（监听 `content:replace`）
- 圆角恢复默认值（16px）时移除内联覆盖，回归构建时 CSS
- 已知边界：圆角只影响使用 `var(--radius-large)` 的元素，个别硬编码 `rounded-2xl` 的元素不随动
- **i18n 键**：`settingsRadius` / `settingsSidebarWidgets` / `settingsLeftSidebar` / `settingsRightSidebar` / `widgetProfile` / `widgetAnnouncement` / `widgetTags` / `widgetCardToc` / `widgetSiteStats` / `widgetCalendar` / `widgetCategories` / `widgetMusic`

---

## 3. 项目推荐页（Recommended Projects / `/recommended-projects/`）

### 功能
顶部菜单"其他"中的新页面，展示推荐的项目与工具。实现方式照搬"项目展示"（projects）：复用 `ProjectCard` 组件与 `Project` 数据结构，数据走内容分离。

### 涉及文件

| 文件 | 说明 |
|------|------|
| `src/pages/recommended-projects.astro` | 页面（PageHeader + ProjectCard 网格，含 featurePages.recommendedProjects 404 守卫） |
| `src/data/recommended-projects.ts` | 数据文件（junction → `content/data/`，随内容仓库同步） |
| `src/config.ts` | `featurePages.recommendedProjects` 开关；"其他"菜单新增 "Recommended Projects" 项 |
| `src/types/config.ts` | featurePages 类型补充 |
| `src/components/organisms/navigation/DropdownMenu.astro` / `NavMenuPanel.astro` | navTitleMap 注册 `"Recommended Projects"` 本地化映射 |

### 添加推荐项目

在 `src/data/recommended-projects.ts`（实际位于内容仓库 `content/data/`）中按 `Project` 结构添加：

```ts
{
	id: "unique-id",
	title: "项目名",
	description: "推荐理由",
	image: "/assets/projects/xxx.webp",   // 可选
	category: "web",                       // web/mobile/desktop/other
	techStack: ["Astro", "TypeScript"],
	status: "completed",                   // completed/in-progress/planned
	visitUrl: "https://example.com",
	sourceCode: "https://github.com/...",
	startDate: "2024-01-01",
	featured: true,                        // 可选，显示星标
},
```

- **i18n 键**：`recommendedProjects` / `recommendedProjectsSubtitle`
- **注意**：新文件需在内容仓库提交推送才会同步到其他构建环境

---

## 4. 导航菜单本地化修复

- 原版 `navTitleMap` 中 `Footprints: I18nKey.footprints` 引用了不存在的枚举键（实际为 `footprint`），且与 config.ts 中菜单名 `Footprint`（单数）不匹配，导致中文下菜单仍显示英文 "Footprint"
- 修复：`Footprints` 和 `Footprint` 都映射到 `I18nKey.footprint`（DropdownMenu.astro 与 NavMenuPanel.astro 两处）
- **维护提醒**：新增菜单项时，若菜单名（config.ts 中的 `name`）不在 `navTitleMap` 中，将直接显示原始英文名；需同时在两个文件的 `navTitleMap` 注册映射

---

## 5. 其他杂项修复

- `src/i18n/i18nKey.ts`：修复 `footprintEmpty` 枚举值尾部多余空格
- `src/styles/main.css`：删除原地图弹窗样式块（引用了不存在的 `--popup-*` 变量且滥用 `!important`），迁移至 `src/styles/map.css` 并改用真实主题变量（`--card-bg` / `--primary` / `--btn-content` / `--line-divider`）
- 地图缩放按钮：修复深色模式下图标与背景融为一体的问题（按钮添加 `text-[var(--primary)]`，与 Pagination 按钮惯例一致）
- 删除死代码：`src/components/features/map/hooks/useFootprintMap.ts`（从未被引用且类型错误）

---

## 6. 维护备忘

- **主题更新合并时**：重点检查本文档第 1-4 节涉及文件；上游若改动 SidebarColumn / Navbar / DropdownMenu / NavMenuPanel / main.css，需手动合并个人定制部分
- **内容分离链路**：`src/data`、`src/content/posts`、`src/content/spec`、`public/images` 均为指向 `content/` 的 junction，新增数据文件直接放 `src/data` 即自动进入内容仓库
- **本地瓦片更新**：替换 `public/tiles/` 后按实际覆盖级别调整 `MapConfig` 的 minZoom/maxZoom

**最后更新**: 2026-08-28
