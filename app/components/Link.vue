<template>
  <component :is="component" v-bind="allProps">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

interface Props {
  to?: string;
  href?: string;
  external?: boolean;
  target?: string;
  rel?: string;
  activeClass?: string;
  exactActiveClass?: string;
  prefetch?: boolean;
  noPrefetch?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  external: false,
  target: undefined,
  rel: undefined,
  prefetch: true,
  noPrefetch: false,
});

const attrs = useAttrs();

const isExternal = computed(() => {
  if (props.external) return true;
  const url = props.to || props.href || '';
  return (
    url.startsWith('http') ||
    url.startsWith('//') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:')
  );
});

const component = computed(() => {
  return isExternal.value ? 'a' : 'NuxtLink';
});

const linkProps = computed(() => {
  if (isExternal.value) {
    return {
      href: props.to || props.href,
      target: props.target || '_blank',
      rel: props.rel || 'noopener noreferrer',
    };
  } else {
    return {
      to: props.to || props.href,
      activeClass: props.activeClass,
      exactActiveClass: props.exactActiveClass,
      prefetch: props.noPrefetch ? false : props.prefetch,
    };
  }
});

const allProps = computed(() => {
  return { ...linkProps.value, ...attrs };
});
</script>
