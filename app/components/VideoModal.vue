<script setup lang="ts">
import '@mux/mux-player';
const { isVideoModalOpen, playbackId, closeVideoModal } = useVideoModal();
const { $gsap } = useNuxtApp();
const gsap = $gsap as typeof import('gsap').gsap;
const { $lenis } = useNuxtApp();
const lenis = $lenis as any;

const modalRef = ref<HTMLElement | null>(null);
const backdropRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const playerRef = ref<HTMLElement | null>(null);

// Handle ESC key
const handleEscKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isVideoModalOpen.value) {
    closeVideoModal();
  }
};

// Watch for modal state changes
watch(isVideoModalOpen, isOpen => {
  if (!gsap || !modalRef.value || !backdropRef.value || !contentRef.value)
    return;

  // Handle Lenis scroll lock
  if (lenis) {
    if (isOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }

  if (isOpen) {
    // Open animation
    gsap.set(modalRef.value, { display: 'flex' });
    gsap.set(backdropRef.value, { opacity: 0 });
    gsap.set(contentRef.value, { scale: 0.9, opacity: 0 });

    gsap.to(backdropRef.value, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });

    gsap.to(contentRef.value, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
  } else {
    // Close animation
    gsap.to(backdropRef.value, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    });

    gsap.to(contentRef.value, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        if (modalRef.value) {
          gsap.set(modalRef.value, { display: 'none' });
        }
      },
    });
  }
});

onMounted(() => {
  // Set initial hidden state
  if (modalRef.value && gsap) {
    gsap.set(modalRef.value, { display: 'none' });
  }

  document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey);
});
</script>

<template>
  <div
    ref="modalRef"
    class="fixed inset-0 z-100 hidden items-center justify-center"
    :class="{ 'pointer-events-none': !isVideoModalOpen }"
  >
    <!-- Backdrop -->
    <div
      ref="backdropRef"
      class="bg-foreground/40 absolute inset-0 z-0 backdrop-blur-lg"
      @click="closeVideoModal"
    ></div>

    <!-- Close Button -->
    <button
      v-if="isVideoModalOpen"
      class="bg-background/20 text-background hover:bg-background/30 absolute top-5 right-5 z-20 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors"
      aria-label="Close video modal"
      @click="closeVideoModal"
    >
      <svg
        class="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Content -->
    <div
      ref="contentRef"
      class="relative z-10 flex h-full w-full items-center justify-center px-5"
      @click="closeVideoModal"
    >
      <div
        class="relative w-full max-w-7xl overflow-hidden rounded-3xl"
        @click.stop
      >
        <mux-player
          v-if="playbackId"
          ref="playerRef"
          autoplay
          playsinline
          loop
          webkit-playsinline
          disable-cookies
          disable-tracking
          class="w-full"
          style="aspect-ratio: 16/9"
          preload
          controls="true"
          accent-color="#F4F4F4"
          :playback-id="playbackId"
        />
      </div>
    </div>
  </div>
</template>
