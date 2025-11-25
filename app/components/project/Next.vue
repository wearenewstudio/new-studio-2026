<template>
  <section class="container pt-60 pb-40">
    <NuxtLink
      :to="`/work/${props.data?.slug?.current}`"
      data-cursor="Explore Case Study"
    >
      <SectionTitle :title="data?.title" :label="'Next Project'" />

      <div class="custom-grid">
        <div
          data-parallax="trigger"
          data-parallax-start="-10"
          data-parallax-end="10"
          class="col-start-4 col-end-10 overflow-hidden rounded-3xl"
        >
          <div class="origin-center scale-120" data-parallax="target">
            <Media :media="data?.thumbnail" />
          </div>
        </div>
      </div>
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
interface Props {
  data?: {
    title: string;
    subtitle: string;
    slug: {
      current: string;
    };
    thumbnail: {
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
    };
  };
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
});
</script>
