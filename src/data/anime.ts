// 本地番剧数据配置
export interface AnimeItem {
	title: string;
	status: "watching" | "completed" | "planned";
	rating: number;
	cover: string;
	description: string;
	episodes: string;
	year: string;
	genre: string[];
	studio: string;
	link: string;
	progress: number;
	totalEpisodes: number;
	startDate: string;
	endDate: string;
}

const localAnimeList: AnimeItem[] = [
	{
		title: "葬送的芙莉莲-S1",
		status: "completed",
		rating: 9.8,
		cover: "/assets/anime/Frieren-Season1-Post.webp",
		description:
			"勇者小队的旅途结束了，但精灵魔法使芙莉莲的冒险旅途仍在继续",
		episodes: "28 episodes", // 剧集
		year: "2023",
		genre: ["Animate", "Adventure", "异世界"],
		studio: "MADHOUSE",
		link: "https://www.bilibili.com/bangumi/play/ss46089",
		progress: 28,
		totalEpisodes: 28,
		startDate: "2023-09",
		endDate: "2024-03",
	},

	{
		title: "葬送的芙莉莲-S2",
		status: "watching",
		rating: 9.6,
		cover: "/assets/anime/Season_2_key_visual_2.webp",
		description: "芙莉莲一行人继续着他们的旅途",
		episodes: "10 episodes", // 剧集
		year: "2026",
		genre: ["Animate", "Adventure", "异世界"],
		studio: "MADHOUSE",
		link: "none",
		progress: 3,
		totalEpisodes: 10,
		startDate: "2026-01",
		endDate: "2026-03",
	},
	{
		title: "孤独摇滚!-S1",
		status: "completed",
		rating: 9.7,
		cover: "/assets/anime/21_Anime_Main_Key_Visual.webp",
		description: "一起来摇滚吧！",
		episodes: "12 episodes", // 剧集
		year: "2022",
		genre: ["Animate", "Music", "Band"],
		studio: "CloverWorks",
		link: "https://www.bilibili.com/bangumi/play/ep693247",
		progress: 12,
		totalEpisodes: 12,
		startDate: "2022-10",
		endDate: "2022-12",
	},
	{
		title: "紫罗兰永恒花园",
		status: "watching",
		rating: 9.7,
		cover: "/assets/anime/Voilet_Post.webp",
		description: "去探寻",
		episodes: "14 episodes", // 剧集
		year: "2018",
		genre: ["Animate", "Sincerely"],
		studio: "TyoAni",
		link: "https://www.bilibili.com/bangumi/play/ep173286",
		progress: 1,
		totalEpisodes: 14,
		startDate: "2018-01",
		endDate: "2018-04",
	},
];

export default localAnimeList;
