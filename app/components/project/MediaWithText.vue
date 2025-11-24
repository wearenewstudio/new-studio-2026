<template>
  <div
    class="flex flex-col gap-5"
    :style="{
      gridColumn: gridColumn,
      gridRow: gridRow,
    }"
  >
    <div class="h-auto w-full">
      <Media v-if="media" :media="media" class="h-fit w-full" />
    </div>
    <p
      v-if="text"
      class="normal whitespace-pre-line"
      :style="{
        maxWidth: computedTextWidth,
        width: computedTextWidth,
      }"
    >
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    media?: any;
    text?: string;
    mediaSpan?: number;
    gridColumn?: string;
    gridRow?: number | string;
    textWidth?: string;
  }>(),
  {
    mediaSpan: 12,
    text: '',
  }
);

const calculateTextWidth = (mediaSpan: number) => {
  if (mediaSpan >= 12) return '100%';
  if (mediaSpan <= 2) return '100%';

  const textColumnRatio = 2 / mediaSpan;
  const textWidthPercentage = Math.min(textColumnRatio * 100, 100);

  return `${textWidthPercentage}%`;
};

const computedTextWidth = computed(() => {
  if (props.textWidth) return props.textWidth;
  return calculateTextWidth(props.mediaSpan);
});
</script>
