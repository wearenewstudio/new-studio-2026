<template>
  <NuxtLink
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    class="bg-foreground/40 text-background flex w-fit items-center gap-3 rounded-3xl px-6 py-3 backdrop-blur-lg"
    :data-magnetic-strength="magneticStrength"
    :data-magnetic-strength-inner="magneticStrengthInner"
    @click="handleVideoClick"
    data-scramble-hover="link"
  >
    <NuxtImg
      v-if="playbackId"
      :src="`https://image.mux.com/${playbackId}/animated.gif`"
      alt="Video Preview"
      fit="cover"
      class="h-auto w-20 rounded-3xl object-cover"
    />
    <div data-magnetic-inner-target>
      <p data-scramble-hover="target" class="label whitespace-nowrap">
        {{ text }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  href?: string;
  text?: string;
  playbackId?: string;
  magneticStrength?: number | string;
  magneticStrengthInner?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  href: '#',
  text: '',
  playbackId: '',
  magneticStrength: 50,
  magneticStrengthInner: 25,
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

const { openVideoModal } = useVideoModal();

const handleVideoClick = (e: MouseEvent) => {
  if (props.playbackId) {
    e.preventDefault();
    openVideoModal(props.playbackId);
  }
};
</script>
