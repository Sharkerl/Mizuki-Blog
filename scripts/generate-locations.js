// scripts/generate-locations.js  (ESM)
import fs from "fs";
import path from "path";
import { sync as globSync } from "glob";
import matter from "gray-matter";

const CACHE_PATH = path.resolve(".cache", "locations-cache.json");
const OUT_PATH = path.resolve("public", "data", "posts-with-locations.json");

function ensureDir(dir) {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadCache() {
	try {
		return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
	} catch (e) {
		return {};
	}
}
function saveCache(cache) {
	ensureDir(path.dirname(CACHE_PATH));
	fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function parseLocationField(loc) {
	if (!loc) return null;
	if (typeof loc === "string") {
		const parts = loc.split(",").map((s) => s.trim());
		if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
			return { lat: parseFloat(parts[0]), lon: parseFloat(parts[1]) };
		}
		return { name: loc };
	}
	if (typeof loc === "object") {
		if ("lat" in loc && "lon" in loc)
			return { lat: Number(loc.lat), lon: Number(loc.lon) };
		if ("lat" in loc && "lng" in loc)
			return { lat: Number(loc.lat), lon: Number(loc.lng) };
		if ("latitude" in loc && "longitude" in loc)
			return { lat: Number(loc.latitude), lon: Number(loc.longitude) };
		if ("name" in loc) return { name: loc.name };
	}
	return null;
}

async function geocodeNominatim(query, cache) {
	if (!query) return null;
	if (cache[query]) return cache[query];
	const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
	console.log("Geocoding", query);
	const res = await fetch(url, {
		headers: { "User-Agent": "MizukiBlog/1.0 (your-email@example.com)" },
	});
	if (!res.ok) {
		console.warn("Nominatim failed", res.status);
		return null;
	}
	const data = await res.json();
	if (!data || data.length === 0) return null;
	const item = data[0];
	const out = {
		lat: parseFloat(item.lat),
		lon: parseFloat(item.lon),
		display_name: item.display_name,
	};
	cache[query] = out;
	await new Promise((r) => setTimeout(r, 1000)); // 礼貌延迟
	return out;
}

async function main() {
	const cache = loadCache();
	const results = [];
	const patterns = [
		"src/pages/posts/**/*.md",
		"src/pages/posts/**/*.mdx",
		"src/content/**/*.md",
		"src/content/**/*.mdx",
	];
	const files = patterns.flatMap((p) => globSync(p));
	console.log("Found", files.length, "markdown files");

	for (const file of files) {
		const raw = fs.readFileSync(file, "utf-8");
		const { data: frontmatter, content } = matter(raw);
		const locField = parseLocationField(
			frontmatter.location || frontmatter.loc || frontmatter.geolocation,
		);
		let loc = null;
		if (locField) {
			if (locField.lat && locField.lon) {
				loc = { lat: locField.lat, lon: locField.lon };
			} else if (locField.name) {
				const g = await geocodeNominatim(locField.name, cache);
				if (g)
					loc = {
						lat: g.lat,
						lon: g.lon,
						display_name: g.display_name,
					};
			}
		}
		if (loc) {
			const slug =
				frontmatter.slug || path.basename(file, path.extname(file));
			const title = frontmatter.title || slug;
			const excerpt = (
				frontmatter.description ||
				content.slice(0, 150).replace(/\n/g, " ")
			).trim();
			const url = `/posts/${slug}/`;
			results.push({
				slug,
				title,
				url,
				excerpt,
				lat: loc.lat,
				lon: loc.lon,
			});
		}
	}

	ensureDir(path.dirname(OUT_PATH));
	fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
	saveCache(cache);
	console.log("Wrote", OUT_PATH, "with", results.length, "entries");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
