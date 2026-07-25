// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	// Frontend Skills
	{
		id: "cpp",
		name: "C++",
		description:
			"A high-performance systems programming language widely used in game development, system software, and embedded development.",
		icon: "logos:c-plusplus",
		category: "backend",
		level: "beginner",
		experience: { years: 1, months: 4 },
		projects: ["game-engine", "system-optimization"], // 2025. 7
		color: "#00599C",
	},

	// Tools
	{
		id: "git",
		name: "Git",
		description:
			"A distributed version control system, an essential tool for code management and team collaboration.",
		icon: "logos:git-icon",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 6 }, // 2026.2
		color: "#F05032",
	},
	{
		id: "vscode",
		name: "VS Code",
		description:
			"A lightweight but powerful code editor with a rich plugin ecosystem.",
		icon: "logos:visual-studio-code",
		category: "tools",
		level: "intermediate",
		experience: { years: 3, months: 6 }, // 2023
		color: "#007ACC",
	},
	{
		id: "c",
		name: "C",
		description:
			"A general-purpose programming language with a rich ecosystem.",
		icon: "logos:c",
		category: "backend",
		level: "beginner",
		experience: { years: 0, months: 2 }, // 2026.7
		color: "#555555",
	},
	{
		id: "vs",
		name: "Visual Studio",
		description:
			"Visual Studio: IDE and Code Editor for Software Development",
		icon: "logos:visual-studio",
		category: "tools",
		level: "intermediate",
		experience: { years: 1, months: 4 }, // 2025.7
		color: "#c300ff",
	},
	{
		id: "clion",
		name: "CLion",
		description: "CLion: IDE for C and C++ Development",
		icon: "logos:clion",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 2 }, // 2026.7
		color: "#555555",
	},
	{
		id: "claude",
		name: "Claude Code",
		description: "Agentic coding tool for developers.",
		icon: "logos:claude-icon",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 2 }, // 2026.7
		color: "#e07400",
	},
];
