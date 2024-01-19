<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { MultiSelectProps } from "./MultiSelect.d";
import { fetchItems } from "../../services/itemsService";
import { ApiResponse, Item } from "../../types/types";
import IconSpinner from "../icons/IconSpinner.vue";
import IconChevronDown from "../icons/IconChevronDown.vue";
import Chip from "../chip/Chip.vue";
import CheckBox from "../CheckBox/CheckBox.vue";

enum FetchType {
	INITIAL = "INITIAL",
	LOAD_MORE = "LOAD_MORE",
}

const props = defineProps<MultiSelectProps>();
const emits = defineEmits(["update:modelValue", "change"]);

const items = ref<Item[]>([]);
const dropdownVisible = ref(false);
const loading = ref(false);
const loadMore = ref(true);
const disabled = ref(false);
const error = ref(false);

const cursor = ref(0);
const limit = ref(10);

const dropdownRef = ref<HTMLElement | null>(null);

onMounted(async () => {
	getItems(FetchType.INITIAL);
});

const getItems = async (fetchType: FetchType) => {
	try {
		fetchType === FetchType.INITIAL ? (loading.value = true) : (loadMore.value = true);
		const response: ApiResponse = await fetchItems({ cursor: cursor.value, limit: limit.value, apiUrl: props.apiUrl });
		items.value = [...items.value, ...response.items];
		cursor.value = response.pagination.next || 0;
		error.value = false;
	} catch {
		error.value = true;
	} finally {
		loading.value = false;
		loadMore.value = false;
	}
};

const removeOption = (option: Item) => {
	let value = props.modelValue.filter((item: Item) => item.id !== option.id);
	updateModel(value);
};

const updateModel = (value: Item[]) => {
	emits("update:modelValue", value);
	emits("change", value);
};

const show = () => {
	dropdownVisible.value = true;
};

const hide = () => {
	dropdownVisible.value = false;
};

const onContainerClick = (e: Event) => {
	e.stopPropagation();
	if (disabled.value || loading.value) {
		return;
	}
	if (dropdownVisible.value) {
		hide();
	} else {
		show();
	}
};

const isSelected = (option: Item) => {
	return props.modelValue.some((item: Item) => item.id === option.id);
};

const onOptionSelect = (event: MouseEvent, option: Item) => {
	event.stopPropagation();

	if (isSelected(option)) {
		const value = props.modelValue.filter((item: Item) => item.id !== option.id);
		updateModel(value);
	} else {
		const value = [...props.modelValue, option];
		updateModel(value);
	}
};

const onClickOutside = (event: MouseEvent) => {
	if (dropdownVisible.value && !dropdownRef.value?.contains(event.target as Node)) {
		hide();
	}
};

const isScrolledToBottom = (el: HTMLElement) => {
	return el.scrollHeight - el.scrollTop === el.clientHeight;
};

const onScroll = (event: Event) => {
	const target = event.target as HTMLElement;
	if (isScrolledToBottom(target)) {
		getItems(FetchType.LOAD_MORE);
	}
};

onMounted(() => {
	document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", onClickOutside);
});
</script>

<template>
	<div
		ref="container"
		class="multiselect"
		@click="onContainerClick"
		:class="{
			'multiselect--disabled': disabled || loading,
			'multiselect--error': error,
		}"
	>
		

		<div class="multiselect__label__container">
			<div
				class="multiselect__label multiselect__placeholder"
				:class="{ 'multiselect__label--filled': modelValue && modelValue.length > 0 }"
			>
				<Chip v-for="item of modelValue" :key="item.id" @remove="removeOption(item)">
					{{ item.name }}
				</Chip>
				<template v-if="!modelValue || modelValue.length === 0">{{ placeholder || "empty" }}</template>
			</div>
		</div>
		<div class="multiselect__icon">
			<IconSpinner v-if="loading" class="multiselect__icon--loading" />
			<IconChevronDown v-else class="multiselect__icon--chevron-down" />
		</div>

		

	
		<div v-if="dropdownVisible" ref="dropdownRef" class="dropdown">
			<div class="dropdown__wrapper" @scroll="onScroll">
				<ul class="dropdown__list" role="listbox">
					<li
						v-for="option of items"
						:key="option.id"
						class="dropdown__item"
						:class="{
							'dropdown__item--selected': isSelected(option),
						}"
						@click="onOptionSelect($event, option)"
					>
						<CheckBox :checked="isSelected(option)" />
						<span class="option">
							{{ option.name }}
						</span>
					</li>
					<li v-if="!items || (items && items.length === 0)" class="dropdown__empty-message">No items found...</li>
				</ul>
				<div class="dropdown__loader" v-if="loadMore">
					<IconSpinner />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.multiselect {
	background: #ffffff;
	border: 1px solid #cfcfcf;
	transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
	border-radius: 6px;
	width: 25rem;
	display: inline-flex;
	cursor: pointer;
	user-select: none;
	position: relative;

	@media screen and (max-width: 768px) {
		width: 100%;
	}

	&__placeholder {
		color: $primary-color;
	}

	&__label__container {
		overflow: hidden;
		flex: 1 1 auto;
		cursor: pointer;
	}

	&__label {
		padding: 0.75rem 0.75rem;
		transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
		display: block;
		white-space: nowrap;
		cursor: pointer;
		overflow: hidden;
		text-overflow: ellipsis;

		&--filled {
			padding: 0.375rem 0.75rem;
		}
	}

	&__icon {
		background: transparent;
		color: $primary-color;
		width: 3rem;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;

		&--loading,
		&--chevron-down {
			width: 1.25rem;
			height: 1.25rem;
		}
	}

	&--disabled {
		opacity: 0.5;
		cursor: not-allowed;

		& * {
			cursor: not-allowed !important;
		}
	}
}

.dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	background: #ffffff;
	border: 1px solid #cfcfcf;
	border-radius: 6px;
	box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
	z-index: 1000;
	overflow: hidden;
	transition: opacity 0.2s, transform 0.2s;
	transform-origin: top center;

	&__wrapper {
		max-height: 20rem;
		overflow-y: auto;
	}

	&__item {
		padding: 0.75rem 0.75rem;
		transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
		display: block;
		white-space: nowrap;
		cursor: pointer;
		overflow: hidden;
		text-overflow: ellipsis;
		display: flex;
		align-items: center;
		gap: 1rem;

		&--selected {
			background: #e5e7eb;
		}

		&--disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&:hover {
			background: #e5e7eb;
		}
	}

	&__itemGroup {
		padding: 0.75rem 0.75rem;
		transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
		display: block;
		white-space: nowrap;
		cursor: pointer;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__emptyMessage {
		padding: 0.75rem 0.75rem;
		transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
		display: block;
		white-space: nowrap;
		cursor: pointer;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__item--focused {
		background: #e5e7eb;
	}

	&__loader {
		padding: 0.75rem 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
