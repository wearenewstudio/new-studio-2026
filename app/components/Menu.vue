<template>
  <div
    :data-navigation-status="isMenuOpen ? 'active' : 'not-active'"
    class="bold-nav-full text-background pointer-events-none fixed inset-0 z-40"
  >
    <div
      ref="menuTile"
      class="bold-nav-full__tile bg-primary pointer-events-auto fixed inset-0 z-1"
    >
      <!-- Navigation links - centered absolutely -->
      <div class="absolute inset-0 flex items-center justify-center">
        <ul class="bold-nav-full__ul flex flex-col items-center">
          <li
            v-for="(link, index) in navigationLinks"
            :key="index"
            class="bold-nav-full__li relative -mt-4 flex items-center justify-center overflow-hidden"
          >
            <NuxtLink
              :href="link.href"
              :class="[
                'bold-nav-full__link display relative inline-block translate-y-full rotate-[5deg] leading-tight no-underline transition-colors duration-300 ease-in-out',
                { 'is--current text-secondary': isCurrentRoute(link.href) },
              ]"
              :data-link-index="index"
              @click="handleLinkClick"
            >
              <span
                class="bold-nav-full__link-text relative block [text-shadow:0_1.1em_0]"
                :data-link-index="index"
              >
                {{ link.text }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Contact info at bottom -->
      <div
        class="absolute bottom-5 left-0 container flex w-full justify-between"
      >
        <div class="flex flex-col">
          <ScrambleLink href="tel:07956123456">07956123456</ScrambleLink>
          <ScrambleLink href="mailto:hello@wearenew.studio"
            >hello@wearenew.studio</ScrambleLink
          >
        </div>
        <div class="flex flex-col items-end text-right">
          <ScrambleLink href="https://www.instagram.com/wearenewstudio"
            >Instagram</ScrambleLink
          >
          <ScrambleLink href="https://www.linkedin.com/company/newstudio"
            >LinkedIn</ScrambleLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { isMenuOpen, closeMenu } = useMenu();
const menuTile = ref<HTMLElement | null>(null);
const linkRefs = ref<(HTMLElement | null)[]>([]);

const navigationLinks = [
  { href: '/insights', text: 'Insights' },
  { href: '/work', text: 'Case Studies' },
  { href: '/transformations', text: 'Transformations' },
];

const isCurrentRoute = (href: string) => {
  if (href === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(href);
};

const handleLinkClick = () => {
  closeMenu();
};

// ESC key handler
const handleEscKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) {
    closeMenu();
  }
};

// Lenis integration
watch(isMenuOpen, isOpen => {
  const { $lenis } = useNuxtApp();
  const lenis = $lenis as any;

  if (lenis) {
    if (isOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }
});

// GSAP animations
watch(isMenuOpen, isOpen => {
  const { $gsap } = useNuxtApp();
  const gsap = $gsap as typeof import('gsap').gsap;

  if (!gsap || !menuTile.value) return;

  // Set initial state first (using polygon for better GSAP support)
  if (isOpen) {
    // Start from closed state
    gsap.set(menuTile.value, {
      clipPath: 'xywh(5% -10% 90% 10% round 1.5rem)',
    });

    // Then animate to open
    gsap.to(menuTile.value, {
      clipPath: 'xywh(0% 0% 100% 100% round 0rem)',
      duration: 0.5,
      ease: 'power2.inOut',
    });
  } else {
    // Animate to closed state
    gsap.to(menuTile.value, {
      clipPath: 'xywh(5% -10% 90% 10% round 1.5rem)',
      duration: 0.5,
      ease: 'power2.inOut',
    });
  }

  // Animate links
  const links = menuTile.value.querySelectorAll<HTMLElement>(
    '.bold-nav-full__link'
  );
  const linkTexts = menuTile.value.querySelectorAll<HTMLElement>(
    '.bold-nav-full__link-text'
  );

  links.forEach((link, index) => {
    const delay = isOpen
      ? 0.15 + index * 0.025
      : (navigationLinks.length - 1 - index) * 0.025;

    gsap.to(link, {
      y: isOpen ? '0%' : '100%',
      rotation: isOpen ? 0 : 5,
      duration: 0.375,
      delay,
      ease: 'power2.inOut',
    });
  });

  // Reset link text transforms when closing
  if (!isOpen) {
    linkTexts.forEach(text => {
      gsap.set(text, {
        y: '0%',
        rotation: 0,
      });
    });
  }
});

// Initialize menu tile with closed state
onMounted(() => {
  if (!menuTile.value) return;

  const { $gsap } = useNuxtApp();
  const gsap = $gsap as typeof import('gsap').gsap;

  if (!gsap) return;

  // Set initial closed state for tile
  gsap.set(menuTile.value, {
    clipPath: 'xywh(5% -10% 90% 10% round 1.5rem)',
  });

  // Set initial closed state for links
  const links = menuTile.value.querySelectorAll<HTMLElement>(
    '.bold-nav-full__link'
  );
  links.forEach(link => {
    gsap.set(link, {
      y: '100%',
      rotation: 5,
    });
  });

  const listItems =
    menuTile.value.querySelectorAll<HTMLElement>('.bold-nav-full__li');

  // Hover effect: dim all links except hovered
  listItems.forEach(item => {
    const link = item.querySelector('.bold-nav-full__link') as HTMLElement;
    if (!link) return;

    // Store original opacity
    gsap.set(listItems, { opacity: 1 });

    link.addEventListener('mouseenter', () => {
      listItems.forEach(li => {
        if (li !== item) {
          gsap.to(li, {
            opacity: 0.15,
            duration: 0.5,
            ease: 'power2.inOut',
          });
        } else {
          gsap.to(li, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.inOut',
          });
        }
      });
    });

    link.addEventListener('mouseleave', () => {
      listItems.forEach(li => {
        gsap.to(li, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.inOut',
        });
      });
    });

    // Link text hover effect
    const text = item.querySelector('.bold-nav-full__link-text') as HTMLElement;
    if (!text) return;

    link.addEventListener('mouseenter', () => {
      gsap.to(text, {
        y: '-100%',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(text, {
        y: '0%',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    });
  });

  // Setup ESC key handler
  document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey);
});
</script>

<style scoped>
.bold-nav-full__tile {
  /* Initial state - GSAP will control the clip-path */
  clip-path: xywh(5% -10% 90% 10% round 1.5rem);
}
</style>
