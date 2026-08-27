// 日记数据配置
// 用于管理日记页面的数据

export interface DiaryItem {
	id: number;
	content: string;
	date: string;
	images?: string[];
	location?: string;
	mood?: string;
	tags?: string[];
}

// 示例日记数据
const diaryData: DiaryItem[] = [
	{
		id: 1,
		content:
			"The falling speed of cherry blossoms is five centimeters per second!",
		date: "2025-01-15T10:30:00Z",
		images: ["/images/diary/sakura.jpg", "/images/diary/1.webp"],
	},
	{
		id: 2,
		content:
			"今天是竞赛体验营的第六节课, 也就是第七天, 昨天休息一天, 买了高等数学的书回来看, 其实很多天之前就买了. 再过 10 天左右, 20号左右就要军训了, 接着就是高中正式开学了, 我已经到了动漫中主人公的年龄了呀, 要好好珍惜这段时光呢.",
		date: "2026-08-11T19:44:00+08:00",
		images: [],
	},
];

// 获取日记列表（按时间倒序）
export const getDiaryList = (limit?: number) => {
	const sortedData = [...diaryData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 获取所有标签
export const getAllTags = () => {
	const tags = new Set<string>();
	diaryData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};
