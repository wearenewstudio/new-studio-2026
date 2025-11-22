import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Composable for footer parallax animation using GSAP ScrollTrigger
 * Automatically initializes parallax effect based on data attributes in the DOM
 */
export const useFooterParallax = () => {
  const nuxtApp = useNuxtApp();

  // Get GSAP and ScrollTrigger from the plugin, fallback to direct imports
  const gsapInstance = (nuxtApp.$gsap as typeof gsap) || gsap;
  const scrollTriggerInstance =
    (nuxtApp.$ScrollTrigger as typeof ScrollTrigger) || ScrollTrigger;

  // Track initialized elements to prevent duplicate animations
  const initializedElements = new WeakSet<HTMLElement>();

  /**
   * Initialize footer parallax on all elements with [data-footer-parallax] attribute
   */
  const initFooterParallax = () => {
    if (import.meta.server) return;

    if (!gsapInstance || !scrollTriggerInstance) {
      console.warn(
        'GSAP or ScrollTrigger is not available. Footer parallax will not work.'
      );
      return;
    }

    const elements = document.querySelectorAll<HTMLElement>(
      '[data-footer-parallax]'
    );

    if (!elements.length) return;

    elements.forEach(el => {
      // Skip if already initialized
      if (initializedElements.has(el)) return;

      const inner = el.querySelector<HTMLElement>(
        '[data-footer-parallax-inner]'
      );
      const dark = el.querySelector<HTMLElement>('[data-footer-parallax-dark]');

      if (!inner) {
        console.warn(
          'Footer parallax: [data-footer-parallax-inner] element not found'
        );
        return;
      }

      // Kill any existing ScrollTriggers on this element
      scrollTriggerInstance.getAll().forEach(st => {
        if (st.trigger === el) {
          st.kill();
        }
      });

      const tl = gsapInstance.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'clamp(top bottom)',
          end: 'clamp(top top)',
          scrub: true,
        },
      });

      if (inner) {
        tl.from(inner, {
          yPercent: -25,
          ease: 'linear',
        });
      }

      if (dark) {
        tl.from(
          dark,
          {
            opacity: 0.5,
            ease: 'linear',
          },
          '<'
        );
      }

      // Mark as initialized
      initializedElements.add(el);
    });

    // Refresh ScrollTrigger after initialization
    scrollTriggerInstance.refresh();
  };

  return {
    initFooterParallax,
  };
};
