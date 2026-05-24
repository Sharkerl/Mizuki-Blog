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

	{
		title: "Lycoris Recoil",
		status: "completed",
		rating: 9.8,
		cover: "/assets/anime/lkls.webp",
		description: "Girl's gunfight",
		episodes: "12 episodes",
		year: "2022",
		genre: ["Action", "Slice of life"],
		studio: "A-1 Pictures",
		link: "https://www.bilibili.com/bangumi/media/md28338623",
		progress: 12,
		totalEpisodes: 12,
		startDate: "2022-07",
		endDate: "2022-09",
	},

	{
		title: "Yowamushi Pedal",
		status: "watching",
		rating: 9.5,
		cover: "/assets/anime/rynh.webp",
		description: "Girl's daily life, sweet and healing",
		episodes: "12 episodes",
		year: "2015",
		genre: ["Daily life", "Healing"],
		studio: "Nexus",
		link: "https://www.bilibili.com/bangumi/media/md2590",
		progress: 8,
		totalEpisodes: 12,
		startDate: "2015-07",
		endDate: "2015-09",
	},
	{
		title: "Asteroid in Love",
		status: "watching",
		rating: 9.2,
		cover: "/assets/anime/laxxx.webp",
		description: "Meeting girls among the stars, pure love and healing",
		episodes: "12 episodes",
		year: "2020",
		genre: ["Romance", "Healing"],
		studio: "Doga Kobo",
		link: "https://www.bilibili.com/bangumi/media/md28224128",
		progress: 5,
		totalEpisodes: 12,
		startDate: "2020-01",
		endDate: "2020-03",
	},
	{
		title: "Is the Order a Rabbit?",
		status: "planned",
		rating: 9.0,
		cover: "/assets/anime/tz1.webp",
		description: "A group of girls' warm daily life",
		episodes: "12 episodes",
		year: "2014",
		genre: ["Daily life", "Healing"],
		studio: "White Fox",
		link: "https://www.bilibili.com/bangumi/media/md2762",
		progress: 12,
		totalEpisodes: 12,
		startDate: "2014-04",
		endDate: "2014-06",
	},
	{
		title: "The Secret of the Magic Girl",
		status: "watching",
		rating: 9.0,
		cover: "/assets/anime/cmmn.webp",
		description: "Muli, Muli!",
		episodes: "12 episodes",
		year: "2024",
		genre: ["Daily life", "Healing", "Magic"],
		studio: "C2C",
		link: "https://www.bilibili.com/bangumi/media/md26625039",
		progress: 8,
		totalEpisodes: 12,
		startDate: "2025-07",
		endDate: "2025-10",
	},
];

export default localAnimeList;
