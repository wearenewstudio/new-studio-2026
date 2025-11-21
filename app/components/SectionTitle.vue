<template>
  <div class="mb-25 flex w-full flex-col items-center gap-4 text-center">
    <p class="label">{{ label }}</p>
    <h2 class="display">
      {{ title }}
    </h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  label: string;
}>();
</script>
