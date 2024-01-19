<script setup lang="ts">
import { ref } from "vue";
import MultiSelect from "./components/multiselect/MultiSelect.vue";
import { Item } from "./types/types";

const selected = ref<Item[]>([]);
</script>

<template>
	<MultiSelect v-model="selected" apiUrl="http://localhost:3000/api/items" placeholder="Placeholder" />
</template>

<style lang="scss" scoped></style>
