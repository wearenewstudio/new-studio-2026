<template>
  <NuxtLink
    v-if="href"
    :to="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    class="bg-foreground/40 text-background flex w-fit cursor-pointer items-center gap-3 rounded-3xl px-6 py-3 backdrop-blur-lg"
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
  <button
    v-else
    type="button"
    class="bg-foreground/40 text-background flex w-fit cursor-pointer items-center gap-3 rounded-3xl px-6 py-3 backdrop-blur-lg"
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
  </button>
</template>

<script setup lang="ts">
interface Props {
  href?: string;
  text?: string;
  playbackId?: string;
  magneticStrength?: number | string;
  magneticStrengthInner?: number | string;
  onClick?: (e: MouseEvent) => void;
}

const props = withDefaults(defineProps<Props>(), {
  href: undefined,
  text: '',
  playbackId: '',
  magneticStrength: 50,
  magneticStrengthInner: 25,
  onClick: undefined,
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
  } else if (props.onClick) {
    e.preventDefault();
    props.onClick(e);
  }
};
</script>
