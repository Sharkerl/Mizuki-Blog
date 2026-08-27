# 地图（Footprint）功能重构计划

## 概述

将自制的 Leaflet 地图功能改造为符合 Mizuki 项目规范（`docs/rule/`）、功能齐全、无 bug 的版本。核心思路：**服务端分组 + `<template>` 服务端渲染弹窗 + 全局样式表 + Twikoo 式资源加载器**，UI 组件全部替换为项目自带组件库（`Icon`、`Link`、`PageHeader`、`btn-card` 体系）。

---

## 现状分析

### 涉及文件

| 文件 | 现状 |
|------|------|
| `src/pages/map.astro` | 页面入口，解析 `location` → `parseLocation`，无 PageHeader |
| `src/components/features/map/Map.astro` | 全部逻辑内联（初始化、分组、弹窗 DOM 拼接、缩放按钮绑定） |
| `src/components/features/map/MapPopup.astro` | **死代码**，未被引用 |
| `src/components/features/map/MapPopupItem.astro` | **死代码**，未被引用 |
| `src/components/features/map/MapZoomControls.astro` | **死代码**，HTML 语法错误（多余 `</button>`），且 `on:click={fn}` 传函数 props 在 Astro 中根本无效 |
| `src/components/features/map/hooks/useFootprintMap.ts` | **死代码**，从未被 import，类型错误（`map: typeof L`），永远返回 null |
| `src/components/features/map/types.ts` | `MapPost` 类型，正常 |
| `src/styles/main.css` L506-539 | 全局弹窗样式，引用**不存在的 CSS 变量**且滥用 `!important` |
| `src/i18n/i18nKey.ts` L16 | `footprintEmpty = "footprintEmpty "` 值带尾部空格 |
| `public/vendor/leaflet/` | 本地 Leaflet 1.9.4（CSS+JS），保留 |
| `public/tiles/` | 本地瓦片，实际覆盖 **zoom 4-9**（z4-6 中国+日本广域，z7-9 东部中国细节；z4 下 x=6..9 为空目录） |

### 已确认的 Bug 清单

1. **弹窗/标记样式全部失效**：Map.astro `<style>` 是 Astro 作用域样式（自动附加 `:where(.astro-cid-*)` 属性选择器），但弹窗和标记 DOM 是 Leaflet 运行时创建的，没有 cid 属性 → `.map-popup-title`、`.map-marker-root`、`.leaflet-popup.map-popup ...` 等规则**从未生效**。标记圆点目前完全靠 JS 注入的内联样式才可见（违反 CSS 规范"动态样式"条款）。
2. **CSS 变量未定义**：`--popup-bg`、`--popup-content`、`--popup-border`、`--popup-link-light`、`--popup-link-dark` 在全项目无任何定义（main.css 和 Map.astro 都在引用）→ 弹窗背景/文字颜色声明无效，弹窗透明、暗色模式破碎。
3. **main.css 滥用 `!important`**（违反 `04-css-style-guide.md`，且地图专属样式不应放在全局 main.css，违反文件组织规范）。
4. **瓦片 zoom 上限错误**：本地瓦片有 z7-9，代码写死 `maxZoom: 6`，高细节瓦片永远用不上；`fitBounds maxZoom: 5` 同理。
5. **硬编码**：初始中心写死南京 `[32.06, 118.78]`；瓦片边界写死 `[[15,95],[55,150]]`（不含日本，用户位置含日本）；"N posts at this location" 硬编码英文未走 i18n。
6. **Swup 导航问题**：无地图实例清理（Leaflet 每个实例在 window 上挂 resize 监听，反复进出 /map/ 泄漏）；`<link>` 样式表与 `<script src>` 在 swup 容器替换时重复注入；`waitForLeaflet` 用 rAF 轮询等待全局 `L`，脆弱。
7. **i18nKey 尾部空格**：`footprintEmpty = "footprintEmpty "`。
8. **未使用组件库**：空状态用裸 `iconify-icon`（应使用 `Icon` 原子组件）；弹窗链接裸 `<a>`（应使用 `Link` 原子组件）；缩放按钮用文字符号 `+`/`-`/`⤾`（应使用 `Icon` + 项目 `btn-card` 按钮体系，参考 `Pagination.astro` 的 `btn-card w-11 h-11 rounded-lg` 惯用写法）。
9. **死代码**：三个子组件 + 一个 hook 从未被引用，其中两个本身有语法/设计错误。
10. **页面缺少 PageHeader**：其他功能页（anime 等）均有 `PageHeader`，map 页没有。
11. 滚轮缩放完全禁用（用户已确认改为"点击地图后启用，移出后禁用"）。

---

## 改造方案

### 决策依据（已与用户确认）

- 位置数据范围：**中国 + 日本**。
- 滚轮缩放：**点击地图后启用，鼠标移出后禁用**。
- 瓦片上限提升到 z9（东部中国有高细节瓦片，其他区域缺瓦片显示灰色底，属离线瓦片集正常行为）。
- Leaflet 继续从 `/vendor/leaflet/` 本地加载（沿用 Twikoo 组件的懒加载+防重注入模式，避免 swup head 更新问题），不用 npm 打包（`is:inline` 脚本无法 import 模块）。

### 文件变更清单

#### 1. 新建 `src/styles/map.css`（全局样式，替代 main.css 中的地图样式）

- 弹窗外壳（覆盖 Leaflet 默认样式，用**复合选择器提高优先级，不用 `!important`**）：
  - `.leaflet-popup.map-popup .leaflet-popup-content-wrapper` / `.leaflet-popup-tip`：背景 `var(--card-bg)`、圆角 `var(--radius-large, 1rem)`、边框 `1px solid var(--line-divider)`、阴影；`.dark` 下加深阴影。
  - `.leaflet-popup.map-popup .leaflet-popup-content`：margin/行高；关闭按钮颜色 `var(--btn-content)`。
- 弹窗内容（运行时克隆自 `<template>`，全局样式确保生效）：
  - `.map-popup-title`（加粗、`var(--btn-content)`）、`.map-popup-link`（`var(--primary)`，hover 下划线）、`.map-popup-list` / `.map-popup-row`（flex 布局、标题省略号）。
- 标记（替代 JS 内联样式）：`.map-marker-root` 尺寸定位 + `::before` 画圆点（`background: var(--primary)`、白边、阴影；`.dark` 下边框 `rgba(255,255,255,0.9)`）。自定义 className 会替换 Leaflet 默认的 `leaflet-div-icon` 类，因此无需 `!important`。
- 暗色瓦片压暗：`.dark .map-container .leaflet-tile { filter: brightness(0.85) contrast(1.05); }`。

#### 2. 重写 `src/components/features/map/Map.astro`

**Frontmatter**：
- Props：`posts: MapPost[]`、`emptyText`、`viewPostText`、`postsAtLocationText`、`zoomInLabel`、`zoomOutLabel`、`resetViewLabel`。
- 服务端按 `lat,lng` 分组 → `groups: MapGroup[]`（复用现有 `MapPost`，新增 `MapGroup` 类型）。

**模板**：
- 空状态：`Icon` 原子组件（`icon="material-symbols:map-outline"`，大号 + 弱化色）+ 空文案。
- 地图容器 `<div id="footprint-map" class="map-container">`（作用域样式保留在此组件内：尺寸 `clamp(22rem,50vh,38rem)`、圆角、内边距、容器底色）。
- 每组一个 `<template id="map-popup-tpl-{i}">`，内含服务端渲染的 `<MapPopup group={g} .../>`（模板内容携带 cid 属性 + map.css 全局样式，克隆后样式完整生效）。
- `<MapZoomControls ...labels />`（浮动于地图右上角）。

**脚本**（`is:inline define:vars={{ groups }}`，IIFE）：
- **资源加载器**（仿 `Twikoo.astro`）：带 id 防重地注入 `/vendor/leaflet/leaflet.css` 的 `<link>` 与 `/vendor/leaflet/leaflet.js` 的 `<script>`，Promise 化 `onload`，彻底删除 rAF 轮询。
- **实例管理**：`window.__mizukiFootprintMap` 存当前实例；init 前先 `remove()` 旧实例；监听 `window.swup.hooks.on("content:replace")`（及 `swup:enable` 一次性注册），当容器已不在文档中时 `map.remove()` 清理，防止 resize 监听泄漏。
- **地图配置**：
  - `L.map(el, { scrollWheelZoom: false, attributionControl: false })`
  - 滚轮缩放交互：容器 `click` → `map.scrollWheelZoom.enable()`；`mouseleave` → `disable()`。
  - `maxBounds([[16, 72], [56, 152]])`（覆盖中国+日本）。
  - `L.tileLayer("/tiles/{z}/{x}/{y}.png", { minZoom: 4, maxZoom: 9, noWrap: true, bounds: <瓦片请求范围> })`。
- **标记与弹窗**：每组 `L.marker` + `divIcon({ className: "map-marker-root", html: "" })`（圆点由 CSS `::before` 绘制，无内联样式）；`bindPopup(模板克隆节点, { maxWidth: 280, className: "map-popup" })`。
- **视野**：`fitBounds(所有标记, { padding: [48,48], maxZoom: 6 })`；"重置"按钮 = 重新 `fitBounds`（不再依赖硬编码中心点）。
- **缩放按钮**：在控件容器上做**事件委托**（单监听器，`data-action` 分发 zoom-in/zoom-out/reset），杜绝重复绑定。

#### 3. 修改 `src/components/features/map/MapPopup.astro`

- Props：`group: MapGroup`、`viewPostText`、`postsAtLocationText`。
- 单篇：标题 + `Link` 原子组件（`variant="primary"`）"查看文章"。
- 多篇：`{group.items.length} {postsAtLocationText}` 标题 + 列表渲染 `MapPopupItem`。
- 类名与 map.css 对应；不再有英文硬编码。

#### 4. 修改 `src/components/features/map/MapPopupItem.astro`

- Props：`post: MapPost`、`viewPostText`；行内标题（省略号）+ `Link` 原子组件。

#### 5. 重写 `src/components/features/map/MapZoomControls.astro`

- Props：三个 a11y 文案（`zoomInLabel` / `zoomOutLabel` / `resetViewLabel`），**删除无效的 `on:click` 函数 props**。
- 三个按钮：项目惯用 `btn-card w-11 h-11 rounded-lg` + `Icon` 原子组件（`material-symbols:zoom-in` / `material-symbols:zoom-out` / `material-symbols:filter-center-focus`），带 `data-action`、`aria-label`、`title`、`active:scale-90`。
- 修复原有 HTML 语法错误（多余 `</button>`）。

#### 6. 修改 `src/components/features/map/types.ts`

- 保留 `MapPost`，新增 `MapGroup { lat: number; lng: number; items: MapPost[] }`。

#### 7. 删除 `src/components/features/map/hooks/useFootprintMap.ts`

- 死代码且类型错误，逻辑已并入 Map.astro 脚本（项目规范允许删除确认未使用的代码）。

#### 8. 修改 `src/pages/map.astro`

- 顶部 `import "../styles/map.css";`（沿用 anime.astro 的页面级 CSS 引入惯例）。
- 增加 `PageHeader`（title=`i18n(footprint)`，subtitle=`i18n(footprintSubtitle)`），与 anime 页对齐。
- 传参扩展：`postsAtLocationText`、三个缩放按钮 label。
- 保留 `right-sidebar-layout.js` 引入与 `featurePages.footprint` 404 守卫（现状即合理）。

#### 9. 修改 `src/styles/main.css`

- **删除 L506-539 的 `.leaflet-popup.map-popup` 弹窗样式块**（迁移至 map.css 并修复：去 `!important`、替换未定义变量为真实变量 `--card-bg` / `--btn-content` / `--primary` / `--line-divider`）。

#### 10. i18n（4 个语言文件 + i18nKey.ts）

- 修复 `footprintEmpty = "footprintEmpty "` 尾部空格。
- 新增键值（渲染形式为 `{count} {text}`）：

| 键 | en | zh_CN | zh_TW | ja |
|----|----|-------|-------|-----|
| `footprintPostsAtLocation` | posts at this location | 篇文章在此地点 | 篇文章在此地點 | 件の記事がこの場所に |
| `footprintZoomIn` | Zoom in | 放大 | 放大 | 拡大 |
| `footprintZoomOut` | Zoom out | 缩小 | 縮小 | 縮小 |
| `footprintResetView` | Reset view | 重置视野 | 重置視野 | 表示をリセット |

#### 11. 不变的部分

- `src/utils/content-utils.ts` 的 `parseLocation`（实现正确）。
- `src/config.ts`（`featurePages.footprint` 开关与导航项已就绪）。
- `src/content.config.ts` 的 `location` 字段。
- `public/vendor/leaflet/`、`public/tiles/` 静态资源。

---

## 假设与决策

1. **弹窗内容用 `<template>` + 服务端渲染**：既复用 Astro 组件（MapPopup/MapPopupItem/Link），又保证样式生效（map.css 为全局样式，与 cid 无关）。
2. **Leaflet 走 `/vendor/` 懒加载**而非 npm 打包：`is:inline` 脚本（swup 下唯一可靠的重执行方式）无法 import 模块；Twikoo 已验证此模式在本项目 swup 环境下可靠。
3. **maxZoom 9**：z7-9 仅覆盖东部中国，其他区域放大显示灰底——离线瓦片集的正常行为，不算 bug。
4. **fitBounds maxZoom 6**：初始视野不越过 z6（广域瓦片全覆盖的级别），避免落点在无高细节瓦片区域时开局灰屏。
5. 弹窗链接、标题等颜色全部使用 `variables.styl` 中已存在的变量，不新增主题变量。
6. `index.ts` 导出保持 `Map` + types 不变。

---

## 验证步骤

1. **构建**：`npm run build` 通过，无 TS/astro 错误。
2. **开发服务器**（`npm run dev`）访问 `/map/`：
   - 有位置数据时：标记为样式化圆点（primary 色、白边）；点击标记弹窗有卡片背景、圆角、主色链接；同位置多篇文章正确分组并列出。
   - 缩放按钮（+/−/重置）工作正常；放大可到 z9（东部中国出现细节瓦片）。
   - 滚轮默认不缩放；点击地图后可滚轮缩放；鼠标移出后恢复禁用。
   - 视野自动 fitBounds 所有标记；重置按钮回到该视野。
   - 暗色模式：瓦片压暗、弹窗/标记配色正确。
   - 无位置数据时：显示 Icon 空状态。
3. **Swup 导航**：首页 → /map/ → 首页 → /map/ 反复切换，控制台无 "Map container is already initialized" 等错误，无重复注入的 leaflet `<link>/<script>`，内存中旧地图实例被清理。
4. **规范自查**：
   - `Grep '!important'` 在 map.css / Map.astro 中无结果。
   - 无引用未定义 CSS 变量。
   - `npm run build` 产物中 `/map/` 页面包含 map.css 样式。
5. **i18n**：切换语言（zh_CN/en/ja/zh_TW）验证弹窗文案与按钮 title。
