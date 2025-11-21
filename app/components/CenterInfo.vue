<template>
  <section class="custom-grid container py-40">
    <div class="relative col-start-3 col-end-11">
      <p class="label absolute top-0 left-0 mt-1.5">{{ label }}</p>
      <div class="inline">
        <span class="text-spacer" aria-hidden="true" />
        <h2 class="heading-2 inline" data-highlight-text>
          {{ text }}
        </h2>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  label: string;
}>();
</script>
