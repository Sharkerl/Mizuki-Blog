export interface MapPost {
	id: string;
	title: string;
	url: string;
	lat: number;
	lng: number;
}

export interface MapGroup {
	lat: number;
	lng: number;
	items: MapPost[];
}
