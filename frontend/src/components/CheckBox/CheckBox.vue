<script setup lang="ts">
import IconCheck from "../Icons/IconCheck.vue";

defineProps({
	checked: Boolean,
	disabled: Boolean,
});

const emits = defineEmits(["update:modelValue", "change", "focus", "blur"]);

const onChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emits("update:modelValue", target.checked);
	emits("change", target.checked);
};
</script>

<template>
	<div class="checkbox">
		<input
			type="checkbox"
			class="checkbox__input"
			:class="{
				'checkbox__input--disabled': disabled,
				'checkbox__input--checked': checked,
			}"
			:checked="checked"
			:disabled="disabled"
			@change="onChange"
		/>
		<div class="checkbox__input--box">
			<div class="checkbox__input__icon">
				<IconCheck v-if="checked" class="checkbox__input__icon--i" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.checkbox {
	position: relative;
	display: inline-block;
	width: 1.5rem;
	height: 1.5rem;

	&__input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;

		&:checked ~ &--box {
			background-color: #84b92e;
			border: none;
		}

		&:checked ~ &__input--box > &__input__icon > &__input__icon--i {
			display: block;
		}
	}

	&__input--box {
		position: absolute;
		top: 0;
		left: 0;
		height: 1.5rem;
		width: 1.5rem;
		background-color: #fff;
		border: 1px solid #cfcfcf;
		border-radius: 0.25rem;
	}

	&__input__icon {
		position: absolute;
		top: 0;
		left: 0;
		height: 1.5rem;
		width: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__input__icon--i {
		width: 1rem;
		height: 1rem;
		color: #fff;
	}
}
</style>
