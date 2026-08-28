// 书架数据配置文件
// 用于"书架"页面，展示 PDF 书籍卡片，点击在新标签页打开预览
// 增删书籍只需修改下方数组；本文件位于内容仓库（支持内容分离）
//
// PDF 文件放置位置：public/files/books/（需自行创建目录并放入 PDF 文件）

export type BookCover =
	| "default" // 使用 PDF 第一页作为封面（客户端渲染，仅限本地 PDF）
	| "none" // 不显示封面，显示占位卡片（书本图标 + 书名）
	| string; // 封面图 URL

export interface Book {
	title: string; // 书名
	url: string; // PDF 文件路径，如 "/files/books/example.pdf"，或外部链接
	cover?: BookCover; // 封面：default=PDF第一页 | none=占位卡片 | 图片URL（默认 none）
	author?: string; // 作者（可选）
	description?: string; // 简介（可选）
}

export const bookshelfData: Book[] = [
	// 示例：将 PDF 放入 public/assets/book/
	{
		title: "中学奥林匹克竞赛物理教程 力学篇-第二版-程稼夫",
		url: "/files/books/中学奥林匹克竞赛物理教程 力学篇-第二版-程稼夫.pdf",
		cover: "default", // 使用 PDF 第一页作为封面
		author: "程稼夫",
		description: "物理竞赛力学篇",
	},
];
