// 单词本页面交互处理器：排序 + 搜索
// 经 <script is:inline src> 引入，Swup 页面切换时会重新执行
// 排序按钮复用 FilterTabs 原子组件（.filter-tabs-item / data-filter-value）

(function () {
	var GRID_ID = "vocabulary-grid";
	var TOOLBAR_ID = "vocabulary-toolbar";
	var EMPTY_ID = "vocab-empty";

	function initVocabulary() {
		var toolbar = document.getElementById(TOOLBAR_ID);
		var grid = document.getElementById(GRID_ID);
		if (!toolbar || !grid || toolbar.dataset.initialized) {
			return;
		}
		toolbar.dataset.initialized = "true";

		var emptyTip = document.getElementById(EMPTY_ID);
		var searchInput = toolbar.querySelector("#vocab-search");
		var sortButtons = toolbar.querySelectorAll(".filter-tabs-item");

		// 捕获初始 DOM 顺序，作为"默认排序"
		var originalOrder = Array.prototype.slice.call(grid.children);

		function applySearch() {
			var keyword = (searchInput ? searchInput.value : "").trim().toLowerCase();
			var visibleCount = 0;

			Array.prototype.forEach.call(grid.children, function (card) {
				var word = (card.getAttribute("data-word") || "").toLowerCase();
				var translation = (card.getAttribute("data-translation") || "").toLowerCase();
				var visible =
					!keyword ||
					word.indexOf(keyword) !== -1 ||
					translation.indexOf(keyword) !== -1;

				card.style.display = visible ? "" : "none";
				if (visible) {
					visibleCount++;
				}
			});

			if (emptyTip) {
				emptyTip.classList.toggle("hidden", visibleCount > 0);
			}
		}

		function sortCards(mode) {
			var cards = Array.prototype.slice.call(grid.children);

			if (mode === "az") {
				cards.sort(function (a, b) {
					return (a.getAttribute("data-word") || "").localeCompare(
						b.getAttribute("data-word") || "",
					);
				});
			} else if (mode === "random") {
				// Fisher-Yates 洗牌
				for (var i = cards.length - 1; i > 0; i--) {
					var j = Math.floor(Math.random() * (i + 1));
					var tmp = cards[i];
					cards[i] = cards[j];
					cards[j] = tmp;
				}
			} else {
				cards.sort(function (a, b) {
					return originalOrder.indexOf(a) - originalOrder.indexOf(b);
				});
			}

			// 重新挂载以应用新顺序
			cards.forEach(function (card) {
				grid.appendChild(card);
			});
		}

		Array.prototype.forEach.call(sortButtons, function (btn) {
			btn.addEventListener("click", function () {
				var mode = btn.dataset.filterValue || "original";

				// 已激活的非"随机"按钮无需处理；"随机"允许重复点击重新洗牌
				if (btn.classList.contains("active") && mode !== "random") {
					return;
				}

				Array.prototype.forEach.call(sortButtons, function (b) {
					b.classList.remove("active");
				});
				btn.classList.add("active");
				sortCards(mode);
			});
		});

		if (searchInput) {
			searchInput.addEventListener("input", applySearch);
		}

		applySearch();
	}

	function onInit() {
		if (document.getElementById(TOOLBAR_ID)) {
			initVocabulary();
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", onInit);
	} else {
		onInit();
	}

	document.addEventListener("astro:page-load", onInit);
})();
