import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../types/types";

export const fetchItems = async ({
	limit,
	cursor,
	apiUrl,
}: {
	limit: number;
	cursor: number;
	apiUrl: string;
}): Promise<ApiResponse> => {
	try {
		const response: AxiosResponse<ApiResponse> = await axios.get(apiUrl, {
			params: {
				cursor,
				limit,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching items:", error);
		throw error;
	}
};
