<template>
  <NuxtLink
    :to="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :class="mergedClass"
    data-scramble-hover="link"
  >
    <span class="relative z-1" data-scramble-hover="target">
      <slot>{{ props.text }}</slot>
    </span>
    <span class="hover-bg" />
  </NuxtLink>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

interface Props {
  href: string;
  class?: string;
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  href: '#',
  class: '',
  text: '',
});

// Merge classes using tailwind-merge
const mergedClass = computed(() => {
  return twMerge(
    props.class,
    'label w-fit whitespace-nowrap px-1 py-1 relative group leading-none'
  );
});

// Determine if link is external
const isExternal = computed(() => {
  if (!props.href) return false;
  return (
    props.href.startsWith('http://') ||
    props.href.startsWith('https://') ||
    props.href.startsWith('mailto:') ||
    props.href.startsWith('tel:')
  );
});
</script>
