<template>
  <section class="container pt-60 pb-40">
    <NuxtLink
      :to="`/work/${props.data?.slug?.current}`"
      data-cursor="View Project"
    >
      <SectionTitle :title="data?.title" :label="'Next Project'" />

      <div class="custom-grid">
        <div class="col-start-4 col-end-10 rounded-3xl">
          <Media :media="data?.thumbnail" />
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
