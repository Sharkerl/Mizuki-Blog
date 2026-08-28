// 推荐项目数据配置文件
// 用于"项目推荐"页面，展示推荐的项目与工具
// 复用 ProjectCard 组件，数据结构与 projects.ts 的 Project 一致

import type { Project } from "./projects";

export const recommendedProjectsData: Project[] = [
	{
		id: "mizuki",
		title: "Mizuki",
		description:
			"A next-gen Material Design 3 blog theme built with Astro, featuring i18n, dark mode, and responsive design.",
		image: "/assets/projects/mizuki.webp",
		category: "web",
		techStack: ["Astro", "TypeScript", "Tailwind CSS", "Svelte"],
		status: "in-progress",
		sourceCode: "https://github.com/matsuzaka-yuki/Mizuki",
		visitUrl: "https://docs.mizuki.mysqil.com/",
		liveDemo: "https://mizuki.mysqil.com/",
		startDate: "2025-08-12",
		featured: true,
		tags: ["Blog"],
	},
	{
		id: "picgo",
		title: "PicGo",
		description: "The Ultimate Image Uploader for Efficient Creators.",
		image: "/assets/projects/picgo.webp",
		category: "desktop",
		techStack: ["TypeScript"],
		status: "in-progress",
		sourceCode: "https://github.com/Molunerfinn/PicGo",
		visitUrl: "https://docs.picgo.app/zh/gui/guide/config",
		startDate: "2017-12-12",
		featured: false,
		tags: ["ImageHosting"],
	},
];
