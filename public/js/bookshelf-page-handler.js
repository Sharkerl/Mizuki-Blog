// 书架页面交互处理器：PDF 第一页封面渲染（cover: "default" 模式）
// 经 <script is:inline src> 引入，Swup 页面切换时会重新执行
//
// 性能设计：
// - pdf.js 库仅在存在 default 封面卡片时动态加载（不影响其他页面）
// - IntersectionObserver 懒渲染：仅封面进入视口附近才读取 PDF
// - 全局只加载一个 pdf.js worker 实例，渲染结果不缓存（PDF 由浏览器 HTTP 缓存承担）
// - 渲染失败（文件缺失/跨域/损坏）回退占位卡片

(function () {
	var PDFJS_VERSION = "3.11.174";
	var PDFJS_SRC =
		"https://cdn.jsdelivr.net/npm/pdfjs-dist@" +
		PDFJS_VERSION +
		"/build/pdf.min.js";
	var PDFJS_WORKER =
		"https://cdn.jsdelivr.net/npm/pdfjs-dist@" +
		PDFJS_VERSION +
		"/build/pdf.worker.min.js";
	var RENDER_MARGIN = "200px";

	var pdfjsPromise = null;
	var observer = null;

	// 动态加载 pdf.js（全站共享一个 Promise，避免重复加载）
	function loadPdfJs() {
		if (pdfjsPromise) {
			return pdfjsPromise;
		}
		pdfjsPromise = new Promise(function (resolve, reject) {
			if (window.pdfjsLib) {
				resolve(window.pdfjsLib);
				return;
			}
			var script = document.createElement("script");
			script.src = PDFJS_SRC;
			script.onload = function () {
				var lib = window.pdfjsLib;
				if (!lib) {
					reject(new Error("pdfjsLib not found"));
					return;
				}
				lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
				resolve(lib);
			};
			script.onerror = function () {
				pdfjsPromise = null;
				reject(new Error("pdf.js load failed"));
			};
			document.head.appendChild(script);
		});
		return pdfjsPromise;
	}

	function fallback(container) {
		container.classList.add("cover-error");
	}

	// 渲染单个封面：读取 PDF 第一页并转为 canvas
	function renderCover(container) {
		var url = container.getAttribute("data-pdf-cover");
		if (!url) {
			return;
		}
		// 标记进行中，避免重复渲染
		container.removeAttribute("data-pdf-cover");

		loadPdfJs()
			.then(function (pdfjsLib) {
				// disableStream: 避免 pdf.js 流式读取中止产生 ERR_ABORTED 噪音
				return pdfjsLib.getDocument({
					url: url,
					disableStream: true,
				}).promise;
			})
			.then(function (pdf) {
				return pdf.getPage(1);
			})
			.then(function (page) {
				// 按容器宽度 × 设备像素比计算缩放，保证高分屏清晰；上限 3 倍控制内存
				var rect = container.getBoundingClientRect();
				var dpr = window.devicePixelRatio || 1;
				var scale =
					((rect.width || 300) * dpr) /
					page.getViewport({ scale: 1 }).width;
				scale = Math.min(Math.max(scale, 1), 3);
				var viewport = page.getViewport({ scale: scale });

				var canvas = document.createElement("canvas");
				canvas.width = Math.floor(viewport.width);
				canvas.height = Math.floor(viewport.height);
				// 内联样式：canvas 由本脚本动态插入，组件 scoped CSS 匹配不到
				canvas.style.position = "absolute";
				canvas.style.inset = "0";
				canvas.style.width = "100%";
				canvas.style.height = "100%";
				canvas.style.objectFit = "cover";
				canvas.style.display = "block";
				canvas.style.pointerEvents = "none";

				return page
					.render({
						canvasContext: canvas.getContext("2d"),
						viewport: viewport,
					})
					.promise.then(function () {
						// 释放 PDF 文档引用（单页渲染后不再需要）
						container.appendChild(canvas);
					});
			})
			.catch(function () {
				fallback(container);
			});
	}

	function initBookshelf() {
		var containers = document.querySelectorAll("[data-pdf-cover]");
		if (containers.length === 0) {
			return;
		}

		// 断开旧观察器（swup 切页后重新初始化）
		if (observer) {
			observer.disconnect();
			observer = null;
		}

		// 预加载 pdf.js（与 IntersectionObserver 并行，不阻塞）
		loadPdfJs().catch(function () {
			// 库加载失败：全部回退占位
			containers.forEach(function (c) {
				fallback(c);
			});
		});

		observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						observer.unobserve(entry.target);
						renderCover(entry.target);
					}
				});
			},
			{ rootMargin: RENDER_MARGIN },
		);

		containers.forEach(function (c) {
			observer.observe(c);
		});
	}

	function onInit() {
		initBookshelf();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", onInit);
	} else {
		onInit();
	}

	document.addEventListener("astro:page-load", onInit);
})();
