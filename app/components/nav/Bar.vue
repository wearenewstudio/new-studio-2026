<template>
  <header class="custom-grid fixed top-5 z-50 container w-full">
    <nav
      class="bg-foreground/40 text-background border-background/30 z-50 col-start-5 col-end-9 flex items-center justify-between rounded-3xl border px-5 py-3 backdrop-blur-lg"
    >
      <NuxtLink
        href="/"
        aria-label="Go to home"
        @click.prevent="handleLogoClick"
      >
        <LogoIcon class="w-21" />
      </NuxtLink>

      <div class="flex items-center gap-1">
        <ScrambleLink href="/work">Work</ScrambleLink>
        <ScrambleLink href="/about">About</ScrambleLink>
        <ScrambleLink href="/contact">Contact</ScrambleLink>

        <button
          :aria-expanded="isMenuOpen"
          :disabled="isAnimating"
          aria-label="Toggle menu"
          :class="[
            'group relative aspect-square cursor-pointer border-none bg-transparent p-3 outline-none disabled:cursor-not-allowed',
            { 'menu-open': isMenuOpen },
          ]"
          @click="handleMenuToggle"
        >
          <span class="hover-bg" />
          <div class="absolute inset-0 z-1 flex items-center justify-center">
            <div class="relative h-3 w-3">
              <span
                v-for="(box, index) in boxes"
                :key="index"
                class="anim-box absolute h-1 w-1 rounded-[1px] bg-white"
                :class="box.className"
              />
            </div>
          </div>
        </button>
      </div>
    </nav>
    <NavMenu />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { isMenuOpen, toggleMenu, closeMenu } = useMenu();
const isAnimating = ref(false);
const route = useRoute();
const router = useRouter();

const boxes = [
  { className: 'anim-box-top-left top-0 left-0' }, // top-left
  { className: 'anim-box-top-right top-0 right-0' }, // top-right
  { className: 'anim-box-bottom-left bottom-0 left-0' }, // bottom-left
  { className: 'anim-box-bottom-right bottom-0 right-0' }, // bottom-right
];

const handleMenuToggle = () => {
  if (isAnimating.value) return; // Prevent spam clicking
  isAnimating.value = true;
  toggleMenu();
  // Reset cooldown after animation completes (0.4s duration)
  setTimeout(() => {
    isAnimating.value = false;
  }, 500);
};

const handleLogoClick = () => {
  if (route.path === '/') {
    // If we're already at home, scroll to top and close the menu if it's open
    const { $lenis } = useNuxtApp();
    const lenis = $lenis as any;

    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      // Fallback to native smooth scroll if Lenis is not available
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (isMenuOpen.value) {
      closeMenu();
    }
  } else {
    // If we're not at home, navigate to home
    router.push('/');
  }
};
</script>
