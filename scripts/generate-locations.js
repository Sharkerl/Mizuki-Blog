// scripts/generate-locations.js (ESM, 带中文注释与性能优化)
// 说明：此脚本采用两阶段策略：1) 解析所有文章并收集需要 geocode 的“唯一地名”；
// 2) 针对唯一地名依次（或限制并发）执行地理编码并写入缓存；
// 这样避免重复请求、能更好控制速率并提高效率。
// 注意：此脚本使用全局 fetch（Node >= 18）。若 Node 版本 < 18，请安装 node-fetch 并 import。

import fs from "fs";
import path from "path";
import { sync as globSync } from "glob";
import matter from "gray-matter";

const CACHE_PATH = path.resolve(".cache", "locations-cache.json");
const OUT_PATH = path.resolve("public", "data", "posts-with-locations.json");

// 配置：对公共 Nominatim 要礼貌
const GEOCODE_DELAY_MS = 1000; // 对每个未缓存的名字等待 1s（礼貌限速）
const GEOCODE_RETRIES = 1; // 失败时重试次数（可小幅提高成功率）
const GEOCODE_CONCURRENCY = 1; // 并发数（1 表示串行）。如果使用自有服务可调大

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

// 解析 frontmatter 的 location 字段，支持多种写法
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

// 带重试的 geocode helper（针对单个地名）。会把结果存入 cache（引用传入）
async function geocodeNominatimWithRetry(query, cache) {
	if (!query) return null;
	if (cache[query]) return cache[query];

	for (let attempt = 0; attempt <= GEOCODE_RETRIES; attempt++) {
		try {
			const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
			console.log(
				`Geocoding (${attempt + 1}/${GEOCODE_RETRIES + 1}):`,
				query,
			);
			const res = await fetch(url, {
				headers: {
					"User-Agent": "MizukiBlog/1.0 (your-email@example.com)",
				},
			});
			if (!res.ok) {
				console.warn("Nominatim failed", res.status, "for", query);
				// 若是 429/5xx，可在这里选择等待再重试
			} else {
				const data = await res.json();
				if (data && data.length > 0) {
					const item = data[0];
					const out = {
						lat: parseFloat(item.lat),
						lon: parseFloat(item.lon),
						display_name: item.display_name,
					};
					cache[query] = out;
					// 每次成功后立即持久化 cache，避免中断丢失
					saveCache(cache);
					// 礼貌延迟（避免短时间内多次请求）
					await new Promise((r) => setTimeout(r, GEOCODE_DELAY_MS));
					return out;
				} else {
					console.warn("Nominatim returned no results for", query);
				}
			}
		} catch (err) {
			console.warn(
				"Geocode error for",
				query,
				err && err.message ? err.message : err,
			);
		}
		// 如果需要重试，稍作等待后重试
		if (attempt < GEOCODE_RETRIES) {
			await new Promise((r) => setTimeout(r, GEOCODE_DELAY_MS));
		}
	}
	// 最终失败，返回 null（不写入 cache，以便后续手动处理或再次尝试）
	return null;
}

// 简单的并发控制器：接受一个任务数组和并发数（promises 按限流并行执行）
async function runWithConcurrency(tasks, concurrency = 1) {
	const results = [];
	const executing = [];
	for (const task of tasks) {
		const p = Promise.resolve().then(() => task());
		results.push(p);
		executing.push(p);
		if (executing.length >= concurrency) {
			await Promise.race(executing).catch(() => {
				// 捕获单个任务错误以继续其它任务；错误会在 results 中保留为 rejected
			});
			// 清理已完成的 promise
			for (let i = executing.length - 1; i >= 0; i--) {
				if (executing[i].isFulfilled || executing[i].isRejected) {
					executing.splice(i, 1);
				}
			}
			// Note: Promise 对象没有 isFulfilled/isRejected 原生属性，上面用于示意；为避免复杂依赖，这里最好保持 concurrency=1 在 Nominatim 场景
		}
	}
	return Promise.all(results);
}

// 主流程：两阶段（解析 -> geocode 唯一地名 -> 组合结果）
async function main() {
	const cache = loadCache();
	const results = [];

	// 根据项目实际路径调整 glob 模式
	const patterns = [
		"src/pages/posts/**/*.md",
		"src/pages/posts/**/*.mdx",
		"src/content/**/*.md",
		"src/content/**/*.mdx",
	];
	const files = patterns.flatMap((p) => globSync(p));
	console.log("Found", files.length, "markdown files");

	// 第一阶段：解析所有文件并收集需要 geocode 的“唯一地名”
	const entries = []; // 临时存储每篇文章的基本信息与解析的 locField
	const nameSet = new Set(); // 待 geocode 的唯一地名集合
	for (const file of files) {
		const raw = fs.readFileSync(file, "utf-8");
		const { data: frontmatter, content } = matter(raw);

		const locField = parseLocationField(
			frontmatter.location || frontmatter.loc || frontmatter.geolocation,
		);
		entries.push({ file, frontmatter, content, locField });
		if (locField && locField.name) nameSet.add(locField.name);
	}

	console.log("Unique place names to geocode:", nameSet.size);

	// 第二阶段：对唯一地名执行 geocode（串行或有限并发）
	// 这里只示例串行（concurrency = 1），以遵守公共 Nominatim 的使用礼仪
	if (nameSet.size > 0) {
		for (const name of nameSet) {
			if (!cache[name]) {
				// 串行请求并写回 cache（函数内部会在成功后 saveCache）
				await geocodeNominatimWithRetry(name, cache);
			} else {
				// 已缓存，跳过
			}
		}
	}

	// 第三阶段：组装结果（使用已解析好的 cache 或直接坐标）
	for (const e of entries) {
		const { file, frontmatter, content, locField } = e;
		let loc = null;
		if (locField) {
			if (locField.lat && locField.lon) {
				loc = { lat: locField.lat, lon: locField.lon };
			} else if (locField.name) {
				const g = cache[locField.name];
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
			const url = `/posts/${slug}/`; // 按需调整为站点路由
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

	// 写出结果（一次性写入）
	ensureDir(path.dirname(OUT_PATH));
	fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
	// cache 已在地理编码成功时被持久化；此处再确保最终 state 写入
	saveCache(cache);
	console.log("Wrote", OUT_PATH, "with", results.length, "entries");
}

// 运行主流程并处理异常
main().catch((err) => {
	console.error(err);
	process.exit(1);
});
