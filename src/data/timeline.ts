import type { TimelineItem } from "../components/features/timeline/types";

export const timelineData: TimelineItem[] = [
	{
		id: "Primary-School-Graduation",
		title: "Primary School Graduation",
		description:
			"Developed interest in studying, and developed my qualities.",
		type: "education",
		startDate: "2017-09-01",
		endDate: "2023-07-01",
		location: "Nanjing, Jiangsu",
		organization: "Central Primary School of Tangshan",
		skills: ["Reading", "Basic living skills"],
		achievements: [
			"Read lots of books",
			"Learned basic living skills",
			"Enjoy the school life and create many sweet memories",
			"Defeated the COVID-19 pandemic",
		],
		icon: "material-symbols:school",
		color: "#7C3AED",
	},
	{
		id: "Junior-High-School-Graduation",
		title: "Junior High School Graduation",
		description:
			"I learn a lot from the school, and I also begin to learn programming by myself.",
		type: "education",
		startDate: "2023-09-01",
		endDate: "2026-06-21",
		location: "Nanjing, Jiangsu",
		organization: "Nanjing Qiuzhen Middle School",
		skills: ["Basic Subjects", "Basic Programming Concepts"],
		achievements: [
			'Completed first "Hello World" program',
			"Learned basic loops and conditional statements",
			"Developed interest in programming",
		],
		icon: "material-symbols:school",
		color: "#7C3AED",
	},
	{
		id: "Senior-High-School-Graduation",
		title: "Senior High School Graduation",
		description:
			"Graduated from junior high school and entered senior high school, swimming in the sea of knowledge.",
		type: "education",
		startDate: "2026-08-05",
		endDate: "",
		location: "Nanjing, Jiangsu",
		organization: "High School Affiliated to Nanjing Normal University",
		skills: ["Advanced Subjects", "Advanced Programming Concepts"],
		achievements: ["Deployed my first personal website powered by Mizuki."],
		icon: "material-symbols:school",
		color: "#31b750",
	},
];
