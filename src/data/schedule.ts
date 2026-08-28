// 日程簿数据配置文件
// 用于"日程簿"页面，按年份/月份分组的时间线展示
// 增删日程只需修改下方数组；本文件位于内容仓库（支持内容分离）

export interface ScheduleItem {
	title: string; // 日程标题
	date: string; // 开始日期，格式 "YYYY-MM-DD"
	endDate?: string; // 结束日期（跨多日日程），格式 "YYYY-MM-DD"
	description?: string; // 补充描述（支持多段，用 \n 分隔）
	category: string; // 类别标签，如 "假期"、"游戏发售"、"展会"
}

export const scheduleData: ScheduleItem[] = [
	{
		title: "中考",
		date: "2026-06-20",
		endDate: "2026-06-21",
		category: "学习",
	},
	{
		title: "竞赛体验营",
		date: "2026-08-05",
		endDate: "2026-08-16",
		category: "学习",
	},
	{
		title: "军训",
		date: "2026-08-20",
		endDate: "2026-08-26",
		category: "学习",
	},
];
