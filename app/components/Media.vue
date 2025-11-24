<script setup lang="ts">
import '@mux/mux-player';

interface MediaData {
  mediaType?: 'image' | 'video' | 'muxVideo';
  image?: {
    asset?: Record<string, any>;
    alt?: string;
  };
  video?: {
    asset?: Record<string, any>;
  };
  muxVideo?: {
    asset?: {
      playbackId?: string;
      [key: string]: any;
    };
  };
}

interface Props {
  media: MediaData | null | undefined;
  class?: string;
  // Video-specific props
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsinline?: boolean;
  controls?: boolean | string;
  // Image-specific props
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  // Fallback alt text for when image.alt is not available
  alt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  autoplay: true,
  muted: true,
  loop: true,
  playsinline: true,
  controls: false,
  loading: 'lazy',
  alt: '',
});

// Computed properties to extract data from media object
const mediaType = computed(() => props.media?.mediaType);

const imageSrc = computed(() => props.media?.image?.asset?.url);

const videoPlaybackId = computed(() => {
  // For muxVideo, use the playbackId
  if (props.media?.muxVideo?.asset?.playbackId) {
    return props.media.muxVideo.asset.playbackId;
  }
  // For regular video, we'd need to handle differently (not using mux-player)
  // For now, return null if no muxVideo playbackId
  return null;
});

const imageAlt = computed(() => {
  return props.media?.image?.alt || props.alt || '';
});

const imagePlaceholder = computed(() => {
  return props.media?.image?.asset?.metadata?.lqip;
});
</script>

<template>
  <!-- Image rendering -->
  <NuxtImg
    v-if="mediaType === 'image' && imageSrc"
    :src="`${imageSrc}?fm=webp`"
    :alt="imageAlt"
    :width="width"
    :height="height"
    :loading="loading"
    :placeholder="imagePlaceholder"
    fit="cover"
    class="h-full w-full rounded-[inherit] object-cover"
  />

  <!-- Mux Video rendering -->
  <mux-player
    v-else-if="mediaType === 'muxVideo' && videoPlaybackId"
    :playback-id="videoPlaybackId"
    :autoplay="autoplay"
    :muted="muted"
    :loop="loop"
    :playsinline="playsinline"
    :webkit-playsinline="playsinline"
    :controls="controls"
    :disable-cookies="true"
    :disable-tracking="true"
    :preload="true"
    class="h-full w-full"
  />
</template>
