<template>
  <div ref="cursorElement" class="custom-cursor">
    <p ref="cursorParagraph" class="label leading-none">Learn more</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const cursorElement = ref<HTMLElement | null>(null);
const cursorParagraph = ref<HTMLElement | null>(null);

let xTo: ((value: number) => void) | null = null;
let yTo: ((value: number) => void) | null = null;
let currentTarget: HTMLElement | null = null;
let lastText = '';

const initDynamicCustomTextCursor = (): (() => void) | null => {
  if (!cursorElement.value || !cursorParagraph.value) return null;
  if (typeof window === 'undefined') return null;

  const { $gsap } = useNuxtApp();
  const gsap = $gsap as typeof import('gsap').gsap;

  if (!gsap) {
    console.warn('GSAP is not available. Custom cursor will not work.');
    return null;
  }

  const cursorItem = cursorElement.value;
  const cursorParagraphEl = cursorParagraph.value;

  const xOffset = 6;
  const yOffset = 140;
  let cursorIsOnRight = false;

  // Position cursor relative to actual cursor position on page load
  gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset });

  // Use GSAP quick.to for a more performative tween on the cursor
  xTo = gsap.quickTo(cursorItem, 'x', { ease: 'power3' });
  yTo = gsap.quickTo(cursorItem, 'y', { ease: 'power3' });

  // Function to get the width of the cursor element including a buffer
  const getCursorEdgeThreshold = () => {
    return cursorItem.offsetWidth + 16; // Cursor width + 16px margin
  };

  // On mousemove, call the quickTo functions to the actual cursor position
  const handleMouseMove = (e: MouseEvent) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const cursorX = e.clientX;
    const cursorY = e.clientY + scrollY; // Adjust cursorY to account for scroll

    // Default offsets
    let xPercent = xOffset;
    let yPercent = yOffset;

    // Adjust X offset dynamically based on cursor width
    let cursorEdgeThreshold = getCursorEdgeThreshold();

    if (cursorX > windowWidth - cursorEdgeThreshold) {
      cursorIsOnRight = true;
      xPercent = -100;
    } else {
      cursorIsOnRight = false;
    }

    // Adjust Y offset if in the bottom 10% of the current viewport
    if (cursorY > scrollY + windowHeight * 0.9) {
      yPercent = -120;
    }

    if (currentTarget) {
      const newText = currentTarget.getAttribute('data-cursor');

      if (newText !== lastText) {
        // Only update if the text is different
        cursorParagraphEl.innerHTML = newText || '';
        lastText = newText || '';
        // Recalculate edge awareness whenever the text changes
        cursorEdgeThreshold = getCursorEdgeThreshold();
      }
    }

    gsap.to(cursorItem, {
      xPercent: xPercent,
      yPercent: yPercent,
      duration: 0.9,
      ease: 'power3',
    });

    if (xTo && yTo) {
      xTo(cursorX);
      yTo(cursorY - scrollY);
    }
  };

  // Function to setup listeners for elements with data-cursor attribute
  const setupCursorListeners = () => {
    const targets = document.querySelectorAll<HTMLElement>('[data-cursor]');

    targets.forEach(target => {
      // Remove existing listeners if any (to avoid duplicates)
      target.removeEventListener('mouseenter', handleMouseEnter);
      target.removeEventListener('mouseleave', handleMouseLeave);

      // Add new listeners
      target.addEventListener('mouseenter', handleMouseEnter);
      target.addEventListener('mouseleave', handleMouseLeave);
    });
  };

  const handleMouseEnter = (e: Event) => {
    const target = e.currentTarget as HTMLElement;
    currentTarget = target; // Set the current target
    const newText = target.getAttribute('data-cursor');

    // Update only if the text changes
    if (newText !== lastText) {
      cursorParagraphEl.innerHTML = newText || '';
      lastText = newText || '';
      // Recalculate edge awareness whenever the text changes
      getCursorEdgeThreshold();
    }
  };

  const handleMouseLeave = () => {
    currentTarget = null;
  };

  // Setup initial listeners
  setupCursorListeners();

  // Use MutationObserver to watch for dynamically added elements
  const observer = new MutationObserver(() => {
    setupCursorListeners();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('mousemove', handleMouseMove);

  // Cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    observer.disconnect();
    // Remove all listeners
    const targets = document.querySelectorAll<HTMLElement>('[data-cursor]');
    targets.forEach(target => {
      target.removeEventListener('mouseenter', handleMouseEnter);
      target.removeEventListener('mouseleave', handleMouseLeave);
    });
  };
};

let cleanup: (() => void) | null = null;

onMounted(() => {
  // Wait for DOM to be ready
  nextTick(() => {
    cleanup = initDynamicCustomTextCursor();
  });
});

onUnmounted(() => {
  if (cleanup) {
    cleanup();
  }
});
</script>
