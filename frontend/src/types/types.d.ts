export interface Item {
	id: number;
	name: string;
}

export interface Pagination {
	next: number | null;
	previous: number | null;
	limit: number;
}

export interface ApiResponse {
	items: Item[];
	pagination: Pagination;
}
