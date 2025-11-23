<template>
  <section class="custom-grid container py-40">
    <div class="relative col-start-3 col-end-11">
      <p class="label absolute top-0 left-0 mt-1.5">{{ label }}</p>
      <div class="inline">
        <span class="text-spacer" aria-hidden="true" />
        <h2 class="heading-2 inline whitespace-pre-line" data-highlight-text>
          {{ displayedText }}
        </h2>
      </div>
      <div
        v-if="truncate && text.length > truncateLength"
        class="mt-15 flex w-full justify-center"
      >
        <ButtonMagnetic
          :text="isTruncated ? 'Read more' : 'Read less'"
          :on-click="toggleTruncation"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  label: string;
  truncate?: boolean;
  truncateLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  truncate: false,
  truncateLength: 155,
});

const isTruncated = ref(props.truncate);

const displayedText = computed(() => {
  if (!props.truncate || !isTruncated.value) {
    return props.text;
  }
  return props.text.slice(0, props.truncateLength) + '...';
});

const toggleTruncation = () => {
  isTruncated.value = !isTruncated.value;
};
</script>
