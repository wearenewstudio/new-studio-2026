<template>
  <div>
    <section
      class="custom-grid container h-[90dvh] pt-40 pb-20"
      data-snap-section
    >
      <div class="col-start-1 col-end-5 flex flex-col gap-15">
        <h1 class="heading-1 whitespace-pre-line">
          {{ transformations?.title }}
        </h1>
      </div>
      <div class="col-8 flex h-fit justify-end gap-2">
        <p class="label">Scroll</p>
        <Lottie name="mouse" width="1rem" height="auto" :no-margin="true" />
      </div>
    </section>

    <section>
      <section
        class="custom-grid relative z-1 container h-dvh"
        data-snap-section
      >
        <div class="relative col-start-4 col-end-10">
          <div
            class="absolute top-[25vh] aspect-video overflow-hidden rounded-3xl"
            data-transformation-media
          >
            <Media :media="transformations?.hero" />
          </div>
        </div>
      </section>
      <section
        v-for="transformation in transformations?.list"
        :key="transformation._id"
        class="bg-body relative z-2"
        data-snap-section
      >
        <div class="container">
          <hr />
          <div class="custom-grid h-dvh overflow-hidden">
            <div
              class="col-start-1 col-end-4 flex flex-col justify-between py-20"
            >
              <h1 class="heading-1 whitespace-pre-line">
                {{ transformation.title }}
              </h1>
              <p class="medium indent-10 whitespace-pre-line">
                {{ transformation.description }}
              </p>
            </div>

            <div class="relative col-start-4 col-end-10">
              <div
                class="absolute top-[25vh] aspect-video overflow-hidden rounded-3xl"
                data-transformation-media
              >
                <Media :media="transformation.preview" />
              </div>
            </div>

            <div
              class="relative top-[25vh] col-start-11 col-end-13 flex flex-col gap-10"
            >
              <ProjectCol
                v-for="col in transformation.info"
                :key="col._key"
                :title="col.title"
                :items="col.items"
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { SanityDocument } from '@sanity/client';

const TRANSFORMATIONS_QUERY = groq`*[_type == "transformations"][0]{
  title,
  hero {
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
  list[]->{
    title,
    description,
    info,
    preview {
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
    }
  }
}`;

const { data: transformations } = await useSanityQuery<SanityDocument>(
  TRANSFORMATIONS_QUERY
);

const { $gsap, $ScrollTrigger } = useNuxtApp();

onMounted(() => {
  const ctx = $gsap.context(() => {
    const elements = document.querySelectorAll('[data-transformation-media]');

    elements.forEach((el, index) => {
      const section = el.closest('section');

      if (section) {
        if (index === 0) {
          const tl = $gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });

          tl.fromTo(
            el,
            { y: '-10vh', scale: 2 },
            { y: '0vh', scale: 1, ease: 'none' }
          ).to(el, {
            y: '100vh',
            ease: 'none',
          });
        } else {
          $gsap.fromTo(
            el,
            {
              y: '-100vh',
            },
            {
              y: '100vh',
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      }
    });

    // Snap Logic
    // Control the snap threshold (percentage of viewport height)
    const snapThreshold = 0.2;
    const snapSections = document.querySelectorAll('[data-snap-section]');

    if (snapSections.length > 0 && $ScrollTrigger) {
      $ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        snap: {
          snapTo: (progress: number) => {
            const maxScroll = $ScrollTrigger.maxScroll(window);
            const currentScroll = progress * maxScroll;
            const thresholdPx = window.innerHeight * snapThreshold;

            let closestOffset = -1;
            let minDiff = Infinity;

            snapSections.forEach(section => {
              // Calculate absolute top position
              const rect = section.getBoundingClientRect();
              const sectionTop = rect.top + window.scrollY;
              const diff = Math.abs(currentScroll - sectionTop);

              if (diff < minDiff) {
                minDiff = diff;
                closestOffset = sectionTop;
              }
            });

            // Only snap if within threshold
            if (minDiff <= thresholdPx && closestOffset !== -1) {
              return closestOffset / maxScroll;
            }
            return progress;
          },
          duration: { min: 0.2, max: 0.6 },
          ease: 'power3.inOut',
        },
      });
    }
  });

  onUnmounted(() => {
    ctx.revert();
  });
});

console.log(transformations);
</script>
