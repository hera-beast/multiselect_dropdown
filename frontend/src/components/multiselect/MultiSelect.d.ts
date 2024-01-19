export interface MultiSelectProps {
	/**
	 * Value of the select
	 */
	modelValue: any;

	/**
	 * API URL to fetch the options
	 * */
	apiUrl: string;

	/**
	 * Placeholder for the select
	 */
	placeholder?: string | undefined;
}
