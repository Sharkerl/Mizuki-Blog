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

## 6. 部署体积优化（帽子云 300MB 限制）

### 问题
帽子云构建产物限制 300MB，原构建产物约 554MB。

### 原因与修复（554MB → 222.8MB）

| 问题 | 修复 | 节省 |
|------|------|------|
| `public/assets/font/` 34 个 TTF（336MB）全量复制进 dist，压缩脚本只处理 2 个且不清理原文件 | `config.ts` 的 `font.asciiFont/cjkFont.localFonts` 扩展为 main.css 中 @font-face 引用的全部字体；[compress-fonts.js](../../scripts/compress-fonts.js) 末尾新增 `cleanupDistFonts()` 删除 dist 中已被 woff2 替代的原始 TTF | ~331MB |
| `public/images.backup/`（84.6MB）——sync-content.js 首次把 public/images 转为 junction 时的旧备份，一直被复制进 dist | 直接删除（public/images 已是 junction，不会再生成） | 84.6MB |
| `content/images/` 原始大图 84.6MB（TenkiNoKo 相册多个 2-6MB 图） | 新增 [scripts/compress-images.mjs](../../scripts/compress-images.mjs)：sharp 重编码（jpg q82 mozjpeg / png 量化），不改变文件名和格式；已压缩 68 个文件 | ~39MB（原图）+ 对应 _astro 优化副本 |

### 维护要点

- **新增字体文件时**：必须同时加入 `config.ts` 的 `localFonts` 列表并在 `main.css` 声明 @font-face，否则该 TTF 会以原尺寸进入 dist（构建后跑 `node scripts/compress-fonts.js` 可验证）
- **新增图片后**：建议跑 `node scripts/compress-images.mjs`（有损但不可逆；content 是 git 仓库，原始图可通过 git 历史找回；压缩无收益的文件自动跳过）
- **已知例外**：`content/images/albums/TenkiNoKo/1033113.png`（6MB）为特殊 PNG 格式，sharp 无法读取（libspng read error），保持原样；如需压缩需手动转格式
- 构建时间因全量字体压缩增加约 4-5 分钟（34 个字体子集化），属正常
- `.env` 示例的 SSH 地址仅限本地；**云端部署（帽子云等）必须用 HTTPS 格式的 CONTENT_REPO_URL**，否则内容同步克隆会失败

---

## 7. 其他杂项修复

- `src/i18n/i18nKey.ts`：修复 `footprintEmpty` 枚举值尾部多余空格
- `src/styles/main.css`：删除原地图弹窗样式块（引用了不存在的 `--popup-*` 变量且滥用 `!important`），迁移至 `src/styles/map.css` 并改用真实主题变量（`--card-bg` / `--primary` / `--btn-content` / `--line-divider`）
- 地图缩放按钮：修复深色模式下图标与背景融为一体的问题（按钮添加 `text-[var(--primary)]`，与 Pagination 按钮惯例一致）
- 删除死代码：`src/components/features/map/hooks/useFootprintMap.ts`（从未被引用且类型错误）

---

## 9. 主页内容标签栏 + 单词本页（Vocabulary / `/vocabulary/`）

### 功能

1. **主页内容标签栏（HomeTabBar）**：主页分类栏（CategoryBar）上方的切换菜单，默认含"文章"和"单词本"两个按钮，点击"文章"回到文章列表，点击"单词本"进入单词本页。按钮列表在 config.ts 中配置，可随时增删。
2. **单词本页**：一行两列展示单词卡片（单词、中文翻译、词性），支持排序（默认 / A-Z / 随机）与搜索（按单词或翻译实时过滤）。数据走内容分离。

### 涉及文件

| 文件 | 说明 |
|------|------|
| `src/components/features/posts/HomeTabBar.astro` | 主页标签栏组件（card-base 药丸样式，active 高亮随 URL 切换，兼容 swup） |
| `src/components/features/vocabulary/VocabularyToolbar.astro` | 单词本工具栏（FilterTabs 原子组件 + 搜索框） |
| `src/components/features/vocabulary/WordCard.astro` | 单词卡片组件 |
| `src/components/features/vocabulary/index.ts` | barrel 导出 |
| `src/pages/vocabulary.astro` | 单词本页面（组合层，含 featurePages.vocabulary 404 守卫） |
| `src/pages/[...page].astro` | 首页在 CategoryBar 上方插入 `<HomeTabBar />` |
| `public/js/vocabulary-page-handler.js` | 排序 + 搜索交互处理器（经典脚本，swup 切页重新执行） |
| `src/data/wordlist.ts` | 单词数据（junction → `content/data/`，随内容仓库同步） |
| `src/config.ts` | `featurePages.vocabulary` 开关 + `homeTabBar` 配置块 |
| `src/types/config.ts` | `HomeTabBarItem` / `HomeTabBarConfig` 类型、featurePages 补充 |
| `src/i18n/` | 新增键见下 |

### 可配置项（`src/config.ts`）

```ts
featurePages: {
	vocabulary: true, // 单词本页面开关
},

// 主页内容标签栏
homeTabBar: {
	enable: true, // 是否显示整个标签栏菜单
	tabs: [
		// 每个按钮可通过 enable 控制是否显示（不写默认显示）
		{ name: "文章", url: "/", icon: "material-symbols:article", enable: true },
		{ name: "单词本", url: "/vocabulary/", icon: "material-symbols:menu-book", enable: true },
	],
},
```

### 添加单词

在 `src/data/wordlist.ts`（实际位于内容仓库 `content/data/`）中按 `Word` 结构添加：

```ts
export interface Word {
	word: string; // 单词本身
	translation: string; // 中文翻译
	pos: string; // 词性，如 "n."、"v. / adj."
}
```

### 实现要点（维护时注意）

- **按钮文本为字面字符串**：站点语言固定 zh_CN，标签栏按钮不做 i18n（优先"加按钮零成本"）；页面标题/副标题/占位文案走 i18n
- **交互脚本必须用经典脚本**：页面交互逻辑放 `public/js/vocabulary-page-handler.js` 并以 `<script is:inline src>` 引入（与 projects/skills 等页面的 filter-tabs-handler 同模式）。Astro 打包模块 `<script>` 在 swup 切页后不会重新执行，会导致排序/搜索失效
- **排序交互复用 FilterTabs**：handler 监听 `.filter-tabs-item` 的 `data-filter-value`，"随机"按钮可重复点击再次洗牌，其余按钮已激活时跳过
- **搜索框防记录**：`type="search"` + `autocomplete="off"`（另加 `autocapitalize="off"` / `spellcheck="false"`），Chrome 不弹历史记录；已隐藏原生清除按钮
- **搜索框配色**：输入文字与提示字用固定中性灰（不随主题色变化），提示字亮色 `black/35`、暗色 `white/35`，与灰色背景融合
- **i18n 键**：`vocabulary` / `vocabularySubtitle` / `underDevelopment` / `vocabularySortDefault` / `vocabularySortAZ` / `vocabularySortRandom` / `vocabularySearchPlaceholder`
- **注意**：wordlist.ts 新增/修改需在内容仓库提交推送才会同步到其他构建环境

---

## 10. 日程簿页（Schedule / `/schedule/`）

### 功能

主页标签栏新增"日程簿"入口，按**年份 → 月份 → 日程卡片**两级分组的时间线页面，参照 loneapex.cn/calendar 的布局设计，Mizuki 原生风格实现：

- 左侧渐变轴线（主题色 → 草绿），加载时自上而下生长动画
- 年份药丸按钮（可折叠整年）+ 月份药丸按钮（可单独折叠），层级缩进 + 弱化子轴线
- 日程卡片：日期行（跨多日显示区间）、标题、多段描述、类别标签
- 动画：年份区块交错入场、圆点延迟弹出、卡片交错 fade-in-up、悬停上浮、折叠/展开 grid 高度平滑过渡
- 默认全部折叠，仅展开当前月份（当前月无数据时回退到最近月份）并平滑滚动定位

### 涉及文件

| 文件 | 说明 |
|------|------|
| `src/components/features/schedule/ScheduleTimeline.astro` | 时间线组件（年份/月份分组、轴线、折叠样式） |
| `src/components/features/schedule/ScheduleItemCard.astro` | 日程卡片组件 |
| `src/components/features/schedule/index.ts` | barrel 导出 |
| `src/pages/schedule.astro` | 页面（HomeTabBar + PageHeader + 时间线，含 featurePages.schedule 404 守卫） |
| `public/js/schedule-page-handler.js` | 年份/月份两级折叠交互 + 默认展开当前月（经典脚本，swup 切页重新执行） |
| `src/data/schedule.ts` | 日程数据（junction → `content/data/`，随内容仓库同步） |
| `src/config.ts` | `featurePages.schedule` 开关 + homeTabBar 新增"日程簿"按钮 |
| `src/types/config.ts` | featurePages 类型补充 `schedule` |
| `src/i18n/` | 新增键见下 |

### 可配置项（`src/config.ts`）

```ts
featurePages: {
	schedule: true, // 日程簿页面开关
},

// 主页标签栏新增按钮
homeTabBar: {
	tabs: [
		// ...
		{ name: "日程簿", url: "/schedule/", icon: "material-symbols:calendar-month", enable: true },
	],
},
```

### 添加日程

在 `src/data/schedule.ts`（实际位于内容仓库 `content/data/`）中按 `ScheduleItem` 结构添加：

```ts
export interface ScheduleItem {
	title: string; // 日程标题
	date: string; // 开始日期，格式 "YYYY-MM-DD"
	endDate?: string; // 结束日期（跨多日日程），格式 "YYYY-MM-DD"
	description?: string; // 补充描述（支持多段，用 \n 分隔）
	category: string; // 类别标签，如 "假期"、"游戏发售"、"展会"
}
```

### 实现要点（维护时注意）

- **配色约定**：标题/日期/描述用固定中性色（不随主题色变化，深浅模式分别适配）；**类别标签用 `var(--primary)` 跟随主题色**（与单词本词性徽章同机制，深色模式自动用高亮度变体）；年份/月份药丸标签用固定中性色（不用 `--btn-content`——它是主题色派生变量会随色相变化）
- **折叠状态挂在 `<section>` 上**：`data-collapsed` 必须写在 section 而非 button 上（CSS 选择器和 handler 都针对 section），曾因写在 button 上导致折叠完全失效
- **交互脚本必须用经典脚本**：`public/js/schedule-page-handler.js` 以 `<script is:inline src>` 引入，与 vocabulary-page-handler 同模式
- **默认展开逻辑**：handler 加载时计算当前年月（绝对月份值 `年*12+月`），找距离最近的月份 section 展开（含其所属年份），300ms 后平滑滚动定位（留 100px 避开顶栏）
- **i18n 键**：`schedule` / `scheduleSubtitle` / `scheduleYearUnit` / `scheduleMonthUnit`
- **注意**：schedule.ts 新增/修改需在内容仓库提交推送才会同步到其他构建环境（未提交的新文件会被 `git clean -fd` 删除）

---

## 11. 维护备忘

- **主题更新合并时**：重点检查本文档第 1-4、9-10 节涉及文件；上游若改动 SidebarColumn / Navbar / DropdownMenu / NavMenuPanel / main.css / compress-fonts.js / CategoryBar / `[...page].astro`，需手动合并个人定制部分
- **内容分离链路**：`src/data`、`src/content/posts`、`src/content/spec`、`public/images` 均为指向 `content/` 的 junction，新增数据文件直接放 `src/data` 即自动进入内容仓库
- **内容仓库未提交文件会被删除**：`pnpm dev`/`pnpm build` 的 predev/prebuild 执行 sync-content.js 时 `git clean -fd` 会清掉内容仓库中未提交的新文件（wordlist.ts / schedule.ts 曾两次被删）。新增数据文件后应尽快在 `content/` 仓库 commit + push
- **本地瓦片更新**：替换 `public/tiles/` 后按实际覆盖级别调整 `MapConfig` 的 minZoom/maxZoom
- **部署平台**：帽子云需 Node ≥ 22.12（package.json engines 与 .nvmrc 已声明）+ 环境变量 `ENABLE_CONTENT_SYNC=true` 和 HTTPS 格式的 `CONTENT_REPO_URL`
- **dev 服务器样式缓存**：修改组件 `<style>` 后若浏览器显示旧样式（computed color 异常等），重启 dev 服务器并用新标签页/强刷（Ctrl+Shift+R）验证；swup 的页面缓存（cache: true）也会缓存旧版 HTML

**最后更新**: 2026-08-28
