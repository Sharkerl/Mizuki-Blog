// 日程簿页面交互处理器：年份/月份两级折叠/展开 + 默认仅展开当前月份
// 经 <script is:inline src> 引入，Swup 页面切换时会重新执行

(function () {
	var TIMELINE_ID = "schedule-timeline";

	function setCollapsed(section, collapsed) {
		var btn = section.querySelector("button");
		if (collapsed) {
			section.setAttribute("data-collapsed", "");
			if (btn) {
				btn.setAttribute("aria-expanded", "false");
			}
		} else {
			section.removeAttribute("data-collapsed");
			if (btn) {
				btn.setAttribute("aria-expanded", "true");
			}
		}
	}

	function initSchedule() {
		var timeline = document.getElementById(TIMELINE_ID);
		if (!timeline || timeline.dataset.initialized) {
			return;
		}
		timeline.dataset.initialized = "true";

		// 月份折叠/展开
		var months = timeline.querySelectorAll(".schedule-month");
		Array.prototype.forEach.call(months, function (section) {
			var btn = section.querySelector(".schedule-month-btn");
			if (!btn) {
				return;
			}
			btn.addEventListener("click", function () {
				setCollapsed(section, !section.hasAttribute("data-collapsed"));
			});
		});

		// 年份折叠/展开（不影响内部各月份自身的折叠状态）
		var years = timeline.querySelectorAll(".schedule-year");
		Array.prototype.forEach.call(years, function (section) {
			var btn = section.querySelector(".schedule-year-btn");
			if (!btn) {
				return;
			}
			btn.addEventListener("click", function () {
				setCollapsed(section, !section.hasAttribute("data-collapsed"));
			});
		});

		// 默认全部折叠，仅展开当前月份（当前月无数据时回退到距离今天最近的月份）
		var now = new Date();
		var nowAbs = now.getFullYear() * 12 + now.getMonth();

		var target = null;
		var targetDist = Infinity;

		Array.prototype.forEach.call(months, function (section) {
			var key = section.getAttribute("data-month") || "";
			var parts = key.split("-");
			if (parts.length !== 2) {
				return;
			}
			var abs =
				parseInt(parts[0], 10) * 12 + (parseInt(parts[1], 10) - 1);
			var dist = Math.abs(abs - nowAbs);
			if (dist < targetDist) {
				targetDist = dist;
				target = section;
			}
		});

		if (target) {
			setCollapsed(target, false);

			var yearSection = target.closest(".schedule-year");
			if (yearSection) {
				setCollapsed(yearSection, false);
			}

			setTimeout(function () {
				var top =
					target.getBoundingClientRect().top +
					window.pageYOffset -
					100;
				window.scrollTo({ top: top, behavior: "smooth" });
			}, 300);
		}
	}

	function onInit() {
		if (document.getElementById(TIMELINE_ID)) {
			initSchedule();
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", onInit);
	} else {
		onInit();
	}

	document.addEventListener("astro:page-load", onInit);
})();
