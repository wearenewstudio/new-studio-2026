<template>
  <main>
    <ScalingVideoScroll
      :video-src="about?.hero?.media?.muxVideo?.asset?.playbackId"
      :title="about?.hero?.title"
      :eyebrow="about?.hero?.label"
    />

    <CenterInfo
      :text="about?.approach?.description"
      :label="about?.approach?.title"
    />

    <section class="container flex flex-col">
      <div
        class="custom-grid gap-y-10 pb-10"
        v-for="(item, index) in about?.approach?.items"
        :key="item._key"
        data-parallax="trigger"
        data-parallax-start="50"
        data-parallax-end="0"
        data-parallax-scroll-start="top bottom"
        data-parallax-scroll-end="bottom 80%"
        data-parallax-opacity-start="0"
        data-parallax-opacity-end="1"
      >
        <hr class="col-start-1 col-end-13" />
        <div class="col-span-1 col-start-1">
          <p class="label">{{ index + 1 }}</p>
        </div>

        <p class="heading-1 col-start-3 col-end-8 -mt-2">{{ item.title }}</p>

        <p class="normal col-start-8 col-end-12 whitespace-pre-line">
          {{ item.description }}
        </p>
      </div>
    </section>

    <SectionReel :reel="about?.reel" />

    <section class="relative py-40">
      <SectionTitle
        :title="about?.partners?.title"
        :label="about?.partners?.label"
      />
      <div ref="centerContainerRef" class="custom-grid container h-[100dvh]">
        <div
          ref="centerMedia1Ref"
          class="col-span-2 col-start-5 aspect-13/16 rounded-3xl"
        ></div>
        <div
          ref="centerMedia2Ref"
          class="col-span-2 col-start-7 aspect-13/16 rounded-3xl"
        ></div>
      </div>

      <div class="custom-grid container">
        <div
          ref="mediaContainerRef"
          class="about-media-wrapper relative col-span-4 h-fit"
        >
          <!-- Overlay elements that will flip from center to pinned -->
          <div
            ref="flipOverlay1Ref"
            class="pointer-events-none absolute z-50 aspect-13/16 overflow-hidden rounded-3xl"
            style="opacity: 0; visibility: hidden"
          >
            <Media :media="about?.partners?.items[0]?.media" />
          </div>

          <div
            ref="flipOverlay2Ref"
            class="pointer-events-none absolute z-50 aspect-13/16 overflow-hidden rounded-3xl"
            style="opacity: 0; visibility: hidden"
          >
            <Media :media="about?.partners?.items[1]?.media" />
          </div>

          <div>
            <div ref="pinnedMedia1Ref" class="aspect-13/16 rounded-3xl">
              <Media :media="about?.partners?.items[0]?.media" />
            </div>
            <p class="medium mt-2">{{ about?.partners?.items[0]?.name }}</p>
            <p class="label">{{ about?.partners?.items[0]?.position }}</p>
          </div>

          <div>
            <div ref="pinnedMedia2Ref" class="aspect-13/16 rounded-3xl">
              <Media :media="about?.partners?.items[1]?.media" />
            </div>
          </div>
        </div>

        <div
          ref="bioContainerRef"
          class="col-start-9 col-end-13 grid grid-cols-4 gap-5"
        >
          <div class="col-1 h-fit justify-items-end">
            <p class="label">Bio</p>
          </div>
          <div class="col-span-3 h-fit">
            <p class="medium indent-10 whitespace-pre-line">
              {{ about?.partners?.items[0]?.bio }}
            </p>
          </div>

          <div class="col-1 mt-30 h-fit justify-items-end">
            <p class="label">Bio</p>
          </div>
          <div ref="secondBioRef" class="col-span-3 mt-30 h-fit">
            <p class="medium indent-10 whitespace-pre-line">
              {{ about?.partners?.items[1]?.bio }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { SanityDocument } from '@sanity/client';

const { $gsap, $ScrollTrigger, $Flip } = useNuxtApp();
const gsap = $gsap as typeof import('gsap').gsap;
const ScrollTrigger =
  $ScrollTrigger as typeof import('gsap/ScrollTrigger').ScrollTrigger;
const Flip = $Flip as typeof import('gsap/Flip').Flip;

const centerContainerRef = ref<HTMLElement | null>(null);
const centerMedia1Ref = ref<HTMLElement | null>(null);
const centerMedia2Ref = ref<HTMLElement | null>(null);
const mediaContainerRef = ref<HTMLElement | null>(null);
const pinnedMedia1Ref = ref<HTMLElement | null>(null);
const pinnedMedia2Ref = ref<HTMLElement | null>(null);
const flipOverlay1Ref = ref<HTMLElement | null>(null);
const flipOverlay2Ref = ref<HTMLElement | null>(null);
const bioContainerRef = ref<HTMLElement | null>(null);
const secondBioRef = ref<HTMLElement | null>(null);
let gsapContext: ReturnType<typeof gsap.context> | null = null;

const ABOUT_QUERY = groq`*[_type == "about" && _id == "about"][0]{
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
    }
  },
  approach,
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
  partners {
    title,
    label,
    items[] {
      name,
      position,
      bio,
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
      }
    }
  }
}`;

const { data: about } = await useSanityQuery<SanityDocument>(ABOUT_QUERY);

onMounted(() => {
  if (!gsap || !ScrollTrigger || !Flip) {
    console.warn('GSAP, ScrollTrigger, or Flip not available');
    return;
  }

  gsapContext = gsap.context(() => {
    nextTick(() => {
      if (
        !mediaContainerRef.value ||
        !bioContainerRef.value ||
        !secondBioRef.value ||
        !centerMedia1Ref.value ||
        !centerMedia2Ref.value ||
        !pinnedMedia1Ref.value ||
        !pinnedMedia2Ref.value ||
        !flipOverlay1Ref.value ||
        !flipOverlay2Ref.value ||
        !centerContainerRef.value
      )
        return;

      try {
        // Ensure overlay elements are visible and properly set up
        gsap.set([flipOverlay1Ref.value, flipOverlay2Ref.value], {
          autoAlpha: 1,
          visibility: 'visible',
        });

        // Hide pinned items initially
        gsap.set([pinnedMedia1Ref.value, pinnedMedia2Ref.value], {
          autoAlpha: 0,
        });

        // Position overlays to match Center items (Start State)
        Flip.fit(flipOverlay1Ref.value!, centerMedia1Ref.value!);
        Flip.fit(flipOverlay2Ref.value!, centerMedia2Ref.value!);

        // Capture Start State
        const state = Flip.getState(
          [flipOverlay1Ref.value!, flipOverlay2Ref.value!],
          { simple: true }
        );

        // Position overlays to match Pinned items (End State)
        Flip.fit(flipOverlay1Ref.value!, pinnedMedia1Ref.value!);
        Flip.fit(flipOverlay2Ref.value!, pinnedMedia2Ref.value!);

        // Create the Flip Tween
        const flipTween = Flip.from(state, {
          scale: true,
          ease: 'none', // Linear ease for scrub
        });

        // Create Timeline with ScrollTrigger Scrub
        const tl = gsap.timeline();
        tl.add(flipTween, 0);

        ScrollTrigger.create({
          trigger: centerContainerRef.value,
          start: 'top 20%',
          end: 'bottom 20%',
          scrub: true,
          animation: tl,
          onLeave: () => {
            if (!flipOverlay1Ref.value || !flipOverlay2Ref.value) return;
            gsap.set([flipOverlay1Ref.value, flipOverlay2Ref.value], {
              autoAlpha: 0,
            });
            if (!pinnedMedia1Ref.value || !pinnedMedia2Ref.value) return;
            gsap.set([pinnedMedia1Ref.value, pinnedMedia2Ref.value], {
              autoAlpha: 1,
            });
          },
          onEnterBack: () => {
            if (!flipOverlay1Ref.value || !flipOverlay2Ref.value) return;
            gsap.set([flipOverlay1Ref.value, flipOverlay2Ref.value], {
              autoAlpha: 1,
            });
            if (!pinnedMedia1Ref.value || !pinnedMedia2Ref.value) return;
            gsap.set([pinnedMedia1Ref.value, pinnedMedia2Ref.value], {
              autoAlpha: 0,
            });
          },
        });

        // Create ScrollTrigger to pin the media container to the left side
        // The media will stay pinned while scrolling through the bio sections
        ScrollTrigger.create({
          trigger: mediaContainerRef.value,
          start: 'top 20%',
          endTrigger: bioContainerRef.value,
          end: 'bottom 80%',
          pin: true,
        });

        // Animate CSS variables when the top of the media reaches the top of the second bio section
        // Reverses when scrolling back up
        gsap.to(mediaContainerRef.value, {
          '--col-1': '1fr',
          '--col-2': '2fr',
          duration: 0.6,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: secondBioRef.value,
            start: 'top center',
            toggleActions: 'play reverse play reverse',
          },
        });
      } catch (error) {
        console.error('Error initializing GSAP Flip animation:', error);
      }
    });
  });
});

onUnmounted(() => {
  // Clean up all GSAP animations and ScrollTriggers created in this context
  if (gsapContext) {
    try {
      gsapContext.revert();
    } catch (error) {
      console.warn('Error reverting GSAP context:', error);
    }
    gsapContext = null;
  }
});
</script>
