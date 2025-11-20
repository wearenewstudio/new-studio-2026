import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default defineNuxtPlugin(nuxtApp => {
  // Get GSAP and ScrollTrigger from the gsap plugin, fallback to direct imports
  // Since plugins load alphabetically, gsap.client.ts loads before lenis.client.ts
  const gsapInstance = (nuxtApp.$gsap as typeof gsap) || gsap;
  const scrollTrigger =
    (nuxtApp.$ScrollTrigger as typeof ScrollTrigger) || ScrollTrigger;

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync Lenis with GSAP ticker
  gsapInstance.ticker.add(time => {
    lenis.raf(time * 1000);
  });

  gsapInstance.ticker.lagSmoothing(0);

  // Update ScrollTrigger on scroll
  lenis.on('scroll', () => {
    scrollTrigger.update();
  });

  // Make lenis available globally
  return {
    provide: {
      lenis,
    },
  };
});
