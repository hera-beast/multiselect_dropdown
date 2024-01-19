<script setup lang="ts">
import IconXCircle from "../icons/IconXCircle.vue";
const { label } = defineProps({
	label: String,
});
</script>

<template>
	<div class="chip">
		<slot class="chip__label">{{ label }}</slot>
		<button class="chip__remove">
			<IconXCircle class="chip__remove--icon" @click.stop="$emit('remove')" />
		</button>
	</div>
</template>

<style lang="scss" scoped>
.chip {
	padding: 0.375rem 0.75rem;
	margin-right: 0.5rem;
	background: #e5e7eb;
	color: #4b5563;
	border-radius: 16px;
	cursor: default;
	display: inline-flex;
	align-items: center;
	gap: 8px;

	&__remove {
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;

		&--icon {
			width: 1rem;
			height: 1rem;
		}
	}
}
</style>
