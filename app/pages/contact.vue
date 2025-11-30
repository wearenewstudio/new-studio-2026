<template>
  <main>
    <section class="custom-grid container pt-40 pb-20">
      <div class="col-start-1 col-end-5 flex flex-col gap-15">
        <h1 class="heading-1 whitespace-pre-line">
          {{ contact?.title }}
        </h1>
        <h2 class="heading-2 text-secondary whitespace-pre-line">
          {{ contact?.subtitle }}
        </h2>
      </div>
      <div class="col-8 flex h-fit justify-end gap-2">
        <p class="label">Scroll</p>
        <Lottie name="mouse" width="1rem" height="auto" :no-margin="true" />
      </div>
    </section>
    <section class="custom-grid container">
      <div
        data-parallax="trigger"
        data-parallax-start="-10"
        data-parallax-end="10"
        class="col-start-1 col-end-5 overflow-hidden rounded-3xl"
      >
        <div class="scale-140" data-parallax="target">
          <Media :media="contact?.mediaItem1" :parallax="true" />
        </div>
      </div>
      <div
        data-parallax="trigger"
        data-parallax-start="-15"
        data-parallax-end="15"
        class="col-start-5 col-end-13 overflow-hidden rounded-3xl"
      >
        <div class="scale-140" data-parallax="target">
          <Media :media="contact?.mediaItem2" :parallax="true" />
        </div>
      </div>
    </section>
    <section class="custom-grid container py-40">
      <div class="col-start-1 col-end-5 flex flex-col gap-4">
        <p class="label">Location</p>
        <h2 class="heading-2">25 Broadway,<br />Floor 10<br />New York, NY</h2>
      </div>
      <div class="col-start-5 col-end-13 flex flex-col gap-4">
        <p class="label">Location</p>
        <a class="heading-2" href="mailto:hello@newstudio.com"
          >hello@newstudio.com</a
        >
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { SanityDocument } from '@sanity/client';

const CONTACT_QUERY = groq`*[_type == "contact"][0]{
  title,
  subtitle,
  mediaItem1 {
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
  mediaItem2 {
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
}`;

const { data: contact } = await useSanityQuery<SanityDocument>(CONTACT_QUERY);

console.log(contact);
</script>
