export interface FootprintMapOptions {
	posts: {
		id: string;
		title: string;
		url: string;
		lat: number;
		lng: number;
	}[];
	viewPostText: string;
	containerId: string;
	initialCenter: [number, number];
	initialZoom: number;
}

export interface FootprintMapResult {
	map: typeof L;
	initialCenter: [number, number];
	initialZoom: number;
}

export function useFootprintMap(options: FootprintMapOptions): FootprintMapResult | null {
	const { posts, viewPostText, containerId, initialCenter, initialZoom } = options;

	const waitForLeaflet = (): Promise<boolean> =>
		new Promise((resolve) => {
			const check = () => {
				if (typeof L !== "undefined" && document.getElementById(containerId)) {
					resolve(true);
				} else {
					requestAnimationFrame(check);
				}
			};

			check();
		});

	const createPopupContent = (group: {
		lat: number;
		lng: number;
		items: typeof posts;
	}): string => {
		const single = group.items.length === 1;
		const post = group.items[0];

		if (single) {
			return `
				<div class="map-popup">
					<div class="map-popup-title">${escapeHtml(post.title)}</div>
					<a class="map-popup-link" href="${escapeHtml(post.url)}">${escapeHtml(viewPostText || "View Post")}</a>
				</div>
			`;
		}

		const items = group.items
			.map(
				(item) => `
					<div class="map-popup-row">
						<span class="map-popup-title">${escapeHtml(item.title)}</span>
						<a class="map-popup-link" href="${escapeHtml(item.url)}">${escapeHtml(viewPostText || "View Post")}</a>
					</div>
				`,
			)
			.join("");

		return `
			<div class="map-popup">
				<div class="map-popup-title">${group.items.length} posts at this location</div>
				<div class="map-popup-list">
					${items}
				</div>
			</div>
		`;
	};

	const bindZoomButtons = (map: typeof L) => {
		const zoomInBtn = document.querySelector('.map-zoom-btn[data-action="zoom-in"]');
		const zoomOutBtn = document.querySelector('.map-zoom-btn[data-action="zoom-out"]');
		const resetBtn = document.querySelector('.map-zoom-btn[data-action="reset"]');

		zoomInBtn?.addEventListener("click", () => map.zoomIn());
		zoomOutBtn?.addEventListener("click", () => map.zoomOut());
		resetBtn?.addEventListener("click", () => {
			map.setView(initialCenter, initialZoom);
			map.invalidateSize();
		});
	};

	waitForLeaflet().then(() => {
		const mapEl = document.getElementById(containerId);
		if (!mapEl) {
			return;
		}

		const map = L.map(containerId, {
			scrollWheelZoom: false,
			attributionControl: false,
		});

		map.setView(initialCenter, initialZoom);
		map.invalidateSize();

		const tileBounds = L.latLngBounds([
			[15, 95],
			[55, 150],
		]);
		map.setMaxBounds(tileBounds);

		L.tileLayer("/tiles/{z}/{x}/{y}.png", {
			minZoom: 4,
			maxZoom: 6,
		}).addTo(map);

		const markers = L.layerGroup().addTo(map);

		const grouped = new Map<string, { lat: number; lng: number; items: typeof posts }>();
		posts.forEach((post) => {
			const key = `${post.lat},${post.lng}`;
			const current = grouped.get(key) || { lat: post.lat, lng: post.lng, items: [] as typeof posts };
			current.items.push(post);
			grouped.set(key, current);
		});

		grouped.forEach((group) => {
			const marker = L.marker([group.lat, group.lng], {
				icon: L.divIcon({
					className: "map-marker-root",
					html: `
						<div style="position:relative;width:16px;height:16px;">
							<div style="position:absolute;inset:0;border-radius:50%;background:var(--primary);border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.35);"></div>
						</div>
					`,
					iconSize: [16, 16],
					iconAnchor: [8, 8],
					popupAnchor: [0, -12],
				}),
			});

			marker.bindPopup(createPopupContent(group), {
				maxWidth: 280,
				className: "map-popup",
			});
			markers.addLayer(marker);
		});

		const latlngs = posts.map((post) => [post.lat, post.lng] as [number, number]);
		if (latlngs.length > 0) {
			const bounds = L.latLngBounds(latlngs);
			map.fitBounds(bounds, { padding: [48, 48], maxZoom: 5 });
		}

		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => bindZoomButtons(map));
		} else {
			bindZoomButtons(map);
		}

		return {
			map,
			initialCenter,
			initialZoom,
		};
	});

	return null;
}

const escapeHtml = (value: string): string =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
