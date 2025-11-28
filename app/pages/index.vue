<template>
  <div>
    <ScalingVideoScroll
      :video-src="home?.hero?.media?.muxVideo?.asset?.playbackId"
      :title="home?.hero?.title"
      :eyebrow="home?.hero?.label"
    />
    <CenterInfo :text="home?.about?.description" :label="home?.about?.label" />

    <section class="container flex flex-col items-center py-20">
      <SectionTitle :title="'Case Studies'" :label="'Featured Work'" />

      <div class="custom-grid mb-25 gap-y-20">
        <NuxtLink
          v-for="(project, index) in home?.featuredProjects"
          :key="project._id"
          :to="`/work/${project.slug.current}`"
          :class="[
            'flex h-fit w-full flex-col',
            index === 0 ? 'col-start-1 col-end-13 md:col-end-5' : '',
            index === 1 ? 'col-start-1 col-end-13 md:col-start-6' : '',
            index === 2 ? 'col-start-1 col-end-13 md:col-end-7' : '',
            index === 3 ? 'col-start-1 col-end-13 md:col-start-8' : '',
          ]"
          data-cursor="Explore Case Study"
        >
          <div class="aspect-3/2 w-full overflow-hidden rounded-3xl">
            <Media
              v-if="project?.thumbnail"
              :media="project.thumbnail"
              :alt="project.title"
            />
          </div>
          <p class="medium mt-2 mb-1">
            {{ project.title }}
          </p>
          <p class="normal text-gray">
            {{ project.subtitle }}
          </p>
        </NuxtLink>
      </div>

      <ButtonMagnetic text="View All Work" href="/work" />
    </section>

    <SectionReel :reel="home?.reel" />

    <SectionExpertise />
  </div>
</template>

<script setup lang="ts">
import type { SanityDocument } from '@sanity/client';

const HOME_QUERY = groq`*[_type == "home"][0]{
  hero {
    title,
    label,
    media {
      mediaType,
      image {
        asset->,
        alt
      },
      video {
        asset->
      },
      muxVideo {
        asset-> {
          playbackId,
          assetId,
          filename,
          status,
          duration
        }
      }
    },
  },
  about,
  featuredProjects[]->{
    _id,
    title,
    subtitle,
    slug,
    thumbnail {
      mediaType,
      image {
        asset->,
        alt
      },
      video {
        asset->
      },
      muxVideo {
        asset-> {
          playbackId,
          assetId,
          filename,
          status,
          duration
        }
      }
    },
    category
  },
  reel {
    title,
      video {
      asset->
    },
    thumbnail {
      asset->,
      alt
    },
    background {
      mediaType,
      image {
        asset->,
        alt
      },
      video {
        asset->
      },
      muxVideo {
        asset-> {
          playbackId,
          assetId,
          filename,
          status,
          duration
        }
      }
    },
  },
}`;

const { data: home } = await useSanityQuery<SanityDocument>(HOME_QUERY);
</script>
