// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "Astro",
		imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
		desc: "The web framework for content-driven websites",
		siteurl: "https://github.com/withastro/astro",
		tags: ["Framework"],
	},
	{
		id: 2,
		title: "Mizuki Docs",
		imgurl: "https://q.qlogo.cn/headimg_dl?dst_uin=3231515355&spec=640&img_type=jpg",
		desc: "Mizuki User Manual",
		siteurl: "https://docs.mizuki.mysqil.com",
		tags: ["Docs"],
	},
	{
		id: 3,
		title: "Vercel",
		imgurl: "https://avatars.githubusercontent.com/u/14985020?v=4&s=640",
		desc: "Develop. Preview. Ship.",
		siteurl: "https://vercel.com",
		tags: ["Hosting", "Cloud"],
	},
	{
		id: 4,
		title: "GitHub",
		imgurl: "https://avatars.githubusercontent.com/u/9919?v=4&s=640",
		desc: "Where the world builds software",
		siteurl: "https://github.com",
		tags: ["Development", "Platform"],
	},

	{
		id: 5,
		title: "WhaleHD",
		imgurl: "https://cdn.jsdelivr.net/gh/Sharkerl/ImageHostingbyHand/whalehd-460.webp",
		desc: "On-site resource website",
		siteurl: "https://whalehd.com/",
		tags: ["Resources"],
	},
	{
		id: 6,
		title: "维基萌",
		imgurl: "https://cdn.jsdelivr.net/gh/Sharkerl/ImageHostingbyHand/siteDarkLogo.webp",
		desc: "",
		siteurl: "https://panda.wikimoe.com/",
		tags: ["Animation", "Blog"],
	},
	{
		id: 7,
		title: "萌娘百科",
		imgurl: "https://cdn.jsdelivr.net/gh/Sharkerl/ImageHostingbyHand/萌娘logo立字据.webp",
		desc: "萌即是正义！时不时分享一些ACG活动记录与有趣代码的小站！",
		siteurl: "https://mzh.moegirl.org.cn/",
		tags: ["Animation", "Information"],
	},
	{
		id: 8,
		title: "Nanocompress",
		imgurl: "https://cdn.jsdelivr.net/gh/Sharkerl/ImageHostingbyHand/nanocompress.webp",
		desc: "Image handling tools, no uploading",
		siteurl: "https://www.nanocompress.com/",
		tags: ["Handle", "Tools"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
