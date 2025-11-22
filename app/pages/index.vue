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
console.log(home);
</script>

<template>
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
        data-cursor="View Project"
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

    <MagneticButton text="View All Work" href="/work" />
  </section>

  <SectionReel :reel="home?.reel" />

  <section class="pt-20 pb-40">
    <SectionTitle :title="'Expertise'" :label="'Specializing in experiences'" />

    <div class="container flex flex-col gap-5">
      <div class="custom-grid gap-y-5">
        <p class="label col-start-1 col-end-13">Transformational Models</p>
        <div class="line col-start-1 col-end-13" />
        <div class="col-start-1 col-end-4">
          <p class="medium indent-10">
            We offer eight transformation pathways, each built around a pivotal
            moment of change.
          </p>
        </div>
        <div class="col-start-5 col-end-13 -mt-2 flex flex-col gap-1">
          <p class="heading-1">Creation</p>
          <p class="heading-1">Growth</p>
          <p class="heading-1">Expansion</p>
          <p class="heading-1">Repositioning</p>
          <p class="heading-1">Modernization</p>
          <p class="heading-1">Unification</p>
          <p class="heading-1">Reinvention</p>
          <p class="heading-1">Recovery</p>
        </div>
      </div>
      <div class="custom-grid gap-y-5">
        <p class="label col-start-1 col-end-13">Capabilities</p>
        <div class="line col-start-1 col-end-13" />
        <div class="col-start-1 col-end-4">
          <p class="medium indent-10">
            We specialize in crafting seamless and engaging brands, user
            experiences and, functions.
          </p>
        </div>
        <div class="col-start-5 col-end-13 -mt-2 flex flex-col gap-1">
          <p class="heading-1">Strategy</p>
          <p class="heading-1">Design</p>
          <p class="heading-1">Development</p>
          <p class="heading-1">Expression</p>
        </div>
      </div>
      <div class="custom-grid gap-y-5">
        <p class="label col-start-1 col-end-13">Awards</p>
        <div class="line col-start-1 col-end-13" />
        <div class="col-start-1 col-end-4">
          <p class="medium indent-10">
            Though we don’t believe awards are a measurement of success, we got
            them.
          </p>
        </div>
        <div class="col-start-5 col-end-13 -mt-2 flex flex-col gap-1">
          <p class="medium">Communication Arts</p>
          <p class="medium">Graphic Design USA (3x)</p>
          <p class="medium">Awwwards (2x)</p>
        </div>
      </div>
    </div>
  </section>
</template>
