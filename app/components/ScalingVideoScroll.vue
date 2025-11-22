<script setup lang="ts">
interface Props {
  videoSrc: string;
  title: string;
  eyebrow?: string;
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: '[ Resource ]',
  title: '',
  videoSrc: '',
});

import '@mux/mux-player';
const { $gsap, $Flip, $ScrollTrigger } = useNuxtApp();
const gsap = $gsap as typeof import('gsap').gsap;
const Flip = $Flip as typeof import('gsap/Flip').Flip;
const ScrollTrigger =
  $ScrollTrigger as typeof import('gsap/ScrollTrigger').ScrollTrigger;

const { openVideoModal } = useVideoModal();

const containerRef = ref<HTMLElement | null>(null);
const targetRef = ref<HTMLElement | null>(null);
const wrapperElements = ref<HTMLElement[]>([]);
let tl: ReturnType<typeof gsap.timeline> | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
let resizeHandler: (() => void) | null = null;

const handleVideoClick = () => {
  if (props.videoSrc) {
    openVideoModal(props.videoSrc);
  }
};

function flipTimeline() {
  if (!containerRef.value || !targetRef.value) return;

  if (tl) {
    tl.kill();
    gsap.set(targetRef.value, { clearProps: 'all' });
  }

  // Get all wrapper elements from the entire component
  const wrappers = containerRef.value.querySelectorAll<HTMLElement>(
    "[data-flip-element='wrapper']"
  );
  wrapperElements.value = Array.from(wrappers);

  if (wrapperElements.value.length === 0 || !targetRef.value) return;

  // Use the first and last wrapper elements for the scroll trigger
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapperElements.value[0],
      start: 'center center',
      endTrigger: wrapperElements.value[wrapperElements.value.length - 1],
      end: 'center center',
      scrub: 0.25,
    },
  });

  // Loop through each wrapper element
  wrapperElements.value.forEach((element, index) => {
    const nextIndex = index + 1;
    if (nextIndex < wrapperElements.value.length) {
      const nextWrapperEl = wrapperElements.value[nextIndex];
      if (!nextWrapperEl || !targetRef.value) return;

      // Calculate vertical center positions relative to the document
      const nextRect = nextWrapperEl.getBoundingClientRect();
      const thisRect = element.getBoundingClientRect();
      const nextDistance =
        nextRect.top + window.pageYOffset + nextWrapperEl.offsetHeight / 2;
      const thisDistance =
        thisRect.top + window.pageYOffset + element.offsetHeight / 2;
      const offset = nextDistance - thisDistance;

      // Add the Flip.fit tween to the timeline
      const flipTween = Flip.fit(targetRef.value, nextWrapperEl, {
        duration: offset,
        ease: 'none',
      });
      if (flipTween && tl) {
        tl.add(flipTween as any);
      }
    }
  });
}

onMounted(() => {
  if (!gsap || !Flip || !ScrollTrigger) {
    console.warn('GSAP, Flip, or ScrollTrigger not available');
    return;
  }

  nextTick(() => {
    flipTimeline();

    // Handle resize
    resizeHandler = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(() => {
        flipTimeline();
      }, 100);
    };

    window.addEventListener('resize', resizeHandler);
  });
});

onUnmounted(() => {
  if (tl) {
    tl.kill();
  }
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
  // Kill all ScrollTriggers created by this component
  ScrollTrigger.getAll().forEach(st => {
    if (
      st.vars.trigger &&
      containerRef.value?.contains(st.vars.trigger as Node)
    ) {
      st.kill();
    }
  });
});
</script>

<template>
  <div ref="containerRef" class="relative overflow-hidden">
    <!-- Header Section -->
    <section
      class="relative flex min-h-screen flex-col items-center justify-center gap-12 px-[5vw] pt-[25vh] pb-[20vh] text-center"
    >
      <SectionTitle :title="title" :label="eyebrow" />

      <div class="relative w-[20em] rounded-3xl">
        <div class="pb-[56.25%]"></div>

        <div
          @click="handleVideoClick"
          data-flip-element="wrapper"
          class="absolute inset-0 h-full w-full cursor-pointer"
        >
          <div
            ref="targetRef"
            data-flip-element="target"
            class="absolute inset-0 isolate flex h-full w-full items-center justify-center overflow-hidden rounded-3xl"
            :style="{
              transform: 'translateX(0) rotate(0.001deg)',
              willChange: 'transform',
            }"
          >
            <mux-player
              autoplay
              muted
              playsinline
              loop
              webkit-playsinline
              disable-cookies
              disable-tracking
              class="hide-controls absolute inset-0 h-full w-full rounded-[inherit] object-cover"
              preload
              controls="false"
              :playback-id="videoSrc"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Video Section -->
    <section
      class="relative container flex flex-col items-center justify-center gap-[25vh]"
    >
      <div class="relative w-full rounded-3xl">
        <div class="pb-[56.25%]"></div>

        <div
          data-flip-element="wrapper"
          class="absolute inset-0 h-full w-full cursor-pointer"
          @click="handleVideoClick"
        ></div>
      </div>
    </section>
  </div>
</template>
