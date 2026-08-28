// 原始图片压缩脚本
// 用于压缩 content/images 中的大图，减小部署产物体积
// jpg/png 无损尺寸不变，仅重编码压缩；不改变文件名与格式，引用路径不受影响
// 用法: node scripts/compress-images.mjs
// 注意: 有损压缩不可逆，content 为 git 仓库，原始版本可通过 git 历史找回

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 目标目录（content/images 与 public/images 为 junction 同一目录）
const IMAGES_DIR = path.join(__dirname, "../content/images");

// 只压缩超过此大小（字节）的文件，小图收益低
const MIN_SIZE = 200 * 1024;

// jpg 重编码质量（82 在体积与画质间较均衡）
const JPEG_QUALITY = 82;

let totalOriginal = 0;
let totalCompressed = 0;
let processed = 0;

async function walk(dir, files = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(fullPath, files);
		} else {
			files.push(fullPath);
		}
	}
	return files;
}

async function main() {
	if (!fs.existsSync(IMAGES_DIR)) {
		console.log(`⚠ 目录不存在: ${IMAGES_DIR}`);
		process.exit(1);
	}

	const files = (await walk(IMAGES_DIR)).filter((f) =>
		/\.(jpe?g|png)$/i.test(f),
	);

	console.log(`发现 ${files.length} 个 jpg/png 文件，压缩超过 200KB 的...\n`);

	for (const file of files) {
		const originalSize = fs.statSync(file).size;
		if (originalSize < MIN_SIZE) {
			continue;
		}

		const ext = path.extname(file).toLowerCase();
		try {
			const image = sharp(file);
			const meta = await image.metadata();
			const backup = `${file}.tmp-orig`;

			fs.renameSync(file, backup);

			if (ext === ".png") {
				// png：截图类多为照片内容，先尝试 jpeg 化的数据量，
				// 若 png 重编码（palette 量化）更小则保持 png，否则仅在 png 内压缩
				const pngBuffer = await sharp(backup)
					.png({ compressionLevel: 9, palette: true, quality: 90 })
					.toBuffer();
				fs.writeFileSync(file, pngBuffer);
			} else {
				const jpegBuffer = await sharp(backup)
					.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
					.toBuffer();
				fs.writeFileSync(file, jpegBuffer);
			}

			const compressedSize = fs.statSync(file).size;

			if (compressedSize >= originalSize) {
				// 压缩无收益，还原原文件
				fs.rmSync(file);
				fs.renameSync(backup, file);
				console.log(
					`= ${path.relative(IMAGES_DIR, file)} 已足够小，跳过`,
				);
				continue;
			}

			fs.rmSync(backup);
			totalOriginal += originalSize;
			totalCompressed += compressedSize;
			processed++;
			console.log(
				`✓ ${path.relative(IMAGES_DIR, file)} ${(originalSize / 1048576).toFixed(2)} MB → ${(compressedSize / 1048576).toFixed(2)} MB (-${((1 - compressedSize / originalSize) * 100).toFixed(0)}%)`,
			);
		} catch (error) {
			// 出错时确保原文件还原
			const backup = `${file}.tmp-orig`;
			if (fs.existsSync(backup) && !fs.existsSync(file)) {
				fs.renameSync(backup, file);
			}
			console.log(`⚠ ${file} 处理失败: ${error.message}`);
		}
	}

	if (processed > 0) {
		console.log(
			`\n✓ 共压缩 ${processed} 个文件: ${(totalOriginal / 1048576).toFixed(1)} MB → ${(totalCompressed / 1048576).toFixed(1)} MB (节省 ${((totalOriginal - totalCompressed) / 1048576).toFixed(1)} MB)`,
		);
	} else {
		console.log("\n没有需要压缩的文件");
	}
}

main();
