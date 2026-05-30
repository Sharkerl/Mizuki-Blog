// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = Record<string, Device[]> & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	Ipad: [
		{
			name: "Ipad Air 12.9 M3",
			image: "/images/device/Ipad_air_m3.png",
			specs: "Gray / 8G + 256GB",
			description: "iPadOS携手App, 事事溜到飞起",
			link: "https://www.apple.com.cn/ipad-air/",
		},
	],
	// MacbookPro: [
	// 	{
	// 		name: "GL-MT3000",
	// 		image: "/images/device/mt3000.webp",
	// 		specs: "1000Mbps / 2.5G",
	// 		description:
	// 			"Portable WiFi 6 router suitable for business trips and home use.",
	// 		link: "https://www.gl-inet.cn/products/gl-mt3000/",
	// 	},
	// ],
};
