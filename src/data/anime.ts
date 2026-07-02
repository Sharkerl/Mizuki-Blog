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
		description: "春季已经来临, 少佐的季节什么时候到来呢?",
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
	{
		title: "Re:从零开始的异世界生活 新编集版",
		status: "completed",
		rating: 9.6,
		cover: "/assets/anime/Re0-S1.webp",
		description:
			"从零开始的拯救与成长之路, 菜月昴与她们的相遇, 昴是大家的英雄啊.",
		episodes: "13 episodes", // 剧集
		year: "2020",
		genre: ["Animate", "Isekai"],
		studio: "WHITE FOX",
		link: "https://www.bilibili.com/bangumi/play/ss29590",
		progress: 13,
		totalEpisodes: 13,
		startDate: "2020-01",
		endDate: "2020-03",
	},
	{
		title: "Re:从零开始的异世界生活-S2-f",
		status: "completed",
		rating: 9.7,
		cover: "/assets/anime/Re0-S2-f.webp",
		description: "从零开始的拯救与成长之路, 圣域与邸宅的危机.",
		episodes: "13 episodes", // 剧集
		year: "2020",
		genre: ["Animate", "Isekai"],
		studio: "WHITE FOX",
		link: "https://www.bilibili.com/bangumi/play/ss33802",
		progress: 13,
		totalEpisodes: 13,
		startDate: "2020-07",
		endDate: "2020-09",
	},
	{
		title: "Re:从零开始的异世界生活-S2-b",
		status: "completed",
		rating: 9.9,
		cover: "/assets/anime/Re0-S2-b.webp",
		description: "从零开始的拯救与成长之路, 朋友的力量.",
		episodes: "12 episodes", // 剧集
		year: "2021",
		genre: ["Animate", "Isekai"],
		studio: "WHITE FOX",
		link: "https://www.bilibili.com/bangumi/play/ss36429",
		progress: 12,
		totalEpisodes: 12,
		startDate: "2021-01",
		endDate: "2021-03",
	},
	{
		title: "Re:从零开始的异世界生活-S3-袭击篇",
		status: "planned",
		rating: 9.9,
		cover: "/assets/anime/Re_Zero_Season_3_Key_Visual_1.webp",
		description: "从零开始的拯救与成长之路, 水门遭到了魔女教的袭击.",
		episodes: "8 episodes", // 剧集
		year: "2024",
		genre: ["Animate", "Isekai"],
		studio: "WHITE FOX",
		link: "none",
		progress: 8,
		totalEpisodes: 8,
		startDate: "2024-10",
		endDate: "2024-11",
	},
	{
		title: "Re:从零开始的异世界生活-S3-反击篇",
		status: "planned",
		rating: 9.9,
		cover: "/assets/anime/Re_Zero_Season_3_Key_Visual_3.webp",
		description: "从零开始的拯救与成长之路, 各阵营的胜利反击.",
		episodes: "8 episodes", // 剧集
		year: "2025",
		genre: ["Animate", "Isekai"],
		studio: "WHITE FOX",
		link: "none",
		progress: 8,
		totalEpisodes: 8,
		startDate: "2025-2",
		endDate: "2025-3",
	},
	{
		title: "Re:从零开始的异世界生活-S4-丧失篇",
		status: "completed",
		rating: 9.9,
		cover: "/assets/anime/Re_Zero_Season_4_Key_Visual_1.webp",
		description: "从零开始的拯救与成长之路, 大贤者菜月昴?",
		episodes: "8 episodes", // 剧集
		year: "2026",
		genre: ["Animate", "Isekai"],
		studio: "WHITE FOX",
		link: "none",
		progress: 11,
		totalEpisodes: 11,
		startDate: "2026-4",
		endDate: "2026-6",
	},
	{
		title: "Re:从零开始的异世界生活 Memory Snow(雪之回忆)",
		status: "planned",
		rating: 9.9,
		cover: "/assets/anime/BD_Memory_Snow_art.webp",
		description: "在邸宅的温馨回忆",
		episodes: "1 episodes", // 剧集
		year: "2018",
		genre: ["Animate", "Isekai"],
		studio: "WHITE FOX",
		link: "https://www.bilibili.com/bangumi/play/ss31150",
		progress: 0,
		totalEpisodes: 1,
		startDate: "2018-10",
		endDate: "2018-10",
	},
	{
		title: "Re:从零开始的异世界生活 冰结之绊",
		status: "planned",
		rating: 9.9,
		cover: "/assets/anime/ReZero_OVA_Bond_of_Ice_Key_Visual_Clean.webp",
		description: "冰之魔女的故事",
		episodes: "1 episodes", // 剧集
		year: "2019",
		genre: ["Animate", "Isekai"],
		studio: "WHITE FOX",
		link: "https://www.bilibili.com/bangumi/play/ss31151",
		progress: 0,
		totalEpisodes: 1,
		startDate: "2019-11",
		endDate: "2019-11",
	},
	{
		title: "铃芽之旅",
		status: "completed",
		rating: 9.9,
		cover: "/assets/anime/Suzume_Post.webp",
		description: "铃芽的自我救赎之旅, 理解生命的价值.",
		episodes: "1 episodes", // 剧集
		year: "2022",
		genre: ["Animate", "新海诚"],
		studio: "ComixWave Films",
		link: "https://www.bilibili.com/bangumi/play/ss45005?theme=movie",
		progress: 1,
		totalEpisodes: 1,
		startDate: "2022-11-11",
		endDate: "2022-11-11",
	},
	{
		title: "天气之子",
		status: "completed",
		rating: 9.9,
		cover: "/assets/anime/TenkiNoKo_Post.webp",
		description: "即使我已不是晴女, 我仍祈祷, 祈祷与你相遇..",
		episodes: "1 episodes", // 剧集
		year: "2019",
		genre: ["Animate", "新海诚"],
		studio: "ComixWave Films",
		link: "https://www.bilibili.com/bangumi/play/ss33343?theme=movie",
		progress: 1,
		totalEpisodes: 1,
		startDate: "2019-7-19",
		endDate: "2019-7-19",
	},
	{
		title: "你的名字",
		status: "planned",
		rating: 9.9,
		cover: "/assets/anime/KimiNoWa_Post.webp",
		description: "你的名字是----",
		episodes: "1 episodes", // 剧集
		year: "2016",
		genre: ["Animate", "新海诚"],
		studio: "ComixWave Films",
		link: "none",
		progress: 0,
		totalEpisodes: 1,
		startDate: "2016-7-19",
		endDate: "2016-7-19",
	},
	{
		title: "秒速五厘米",
		status: "planned",
		rating: 9.9,
		cover: "/assets/anime/5cmPerSecond_Post.webp",
		description: "樱花落下的速度是----每秒五厘米!",
		episodes: "1 episodes", // 剧集
		year: "2007",
		genre: ["Animate", "新海诚"],
		studio: "ComixWave Films",
		link: "none",
		progress: 0,
		totalEpisodes: 1,
		startDate: "2007-3-3",
		endDate: "2007-3-3",
	},
	{
		title: "别当欧尼酱了",
		status: "completed",
		rating: 9.9,
		cover: "/assets/anime/Brother_Post.webp",
		description: "真寻酱的日常.",
		episodes: "12 episodes", // 剧集
		year: "2023",
		genre: ["Animate", "Daily"],
		studio: "Studio Bind",
		link: "none",
		progress: 12,
		totalEpisodes: 12,
		startDate: "2023-01-05",
		endDate: "2023-03-23",
	},
];

export default localAnimeList;
