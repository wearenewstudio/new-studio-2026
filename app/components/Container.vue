<template>
  <div :class="computedClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge';

interface Props {
  class?: string;
}

const props = defineProps<Props>();

const computedClasses = computed(() => {
  return twMerge('relative mx-auto px-5', props.class);
});
</script>
