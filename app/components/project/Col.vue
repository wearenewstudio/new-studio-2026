<template>
  <div v-if="hasContent" class="flex flex-col gap-2">
    <p class="label">{{ props.title }}</p>
    <ul class="flex flex-col">
      <li v-if="props.items" v-for="item in props.items" :key="item">
        <span class="normal">{{ item }}</span>
      </li>
      <li v-else-if="typeof props.list === 'string'">
        <span class="normal">{{ props.list }}</span>
      </li>
      <li v-else v-for="item in props.list" :key="item?.text">
        <span class="normal">{{ item?.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  list?: Array<{ text: string }> | string;
  items?: string[];
}>();

const hasContent = computed(() => {
  if (props.items?.length) return true;
  if (Array.isArray(props.list)) {
    return props.list.length > 0;
  }
  return !!props.list;
});
</script>
