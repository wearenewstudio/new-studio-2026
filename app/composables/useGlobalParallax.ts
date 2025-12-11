import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Keep track of the MatchMedia instance globally to handle cleanups across page transitions
let mm: gsap.MatchMedia | null = null;

/**
 * Composable for global parallax animation using GSAP ScrollTrigger
 * Based on data attributes: data-parallax="trigger"
 */
export const useGlobalParallax = () => {
  const initGlobalParallax = () => {
    if (import.meta.server) return;

    // Revert existing MatchMedia before creating a new one
    // This ensures we don't duplicate animations or lose track of old ones
    if (mm) {
      mm.revert();
      mm = null;
    }

    // Create new MatchMedia
    mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: '(max-width:479px)',
        isMobileLandscape: '(max-width:767px)',
        isTablet: '(max-width:991px)',
        isDesktop: '(min-width:992px)',
      },
      context => {
        const { isMobile, isMobileLandscape, isTablet } =
          context.conditions as {
            isMobile: boolean;
            isMobileLandscape: boolean;
            isTablet: boolean;
          };

        const ctx = gsap.context(() => {
          const triggers = document.querySelectorAll(
            '[data-parallax="trigger"]'
          );

          triggers.forEach(trigger => {
            // Check if this trigger has to be disabled on smaller breakpoints
            const disable = trigger.getAttribute('data-parallax-disable');
            if (
              (disable === 'mobile' && isMobile) ||
              (disable === 'mobileLandscape' && isMobileLandscape) ||
              (disable === 'tablet' && isTablet)
            ) {
              return;
            }

            // Optional: you can target an element inside a trigger if necessary
            const target =
              trigger.querySelector('[data-parallax="target"]') || trigger;

            // Get the direction value to decide between xPercent or yPercent tween
            const direction =
              trigger.getAttribute('data-parallax-direction') || 'vertical';
            const prop = direction === 'horizontal' ? 'xPercent' : 'yPercent';

            // Get the scrub value, our default is 'true' because that feels nice with Lenis
            const scrubAttr = trigger.getAttribute('data-parallax-scrub');
            const scrub = scrubAttr ? parseFloat(scrubAttr) : true;

            // Get the start position in %
            const startAttr = trigger.getAttribute('data-parallax-start');
            const startVal = startAttr !== null ? parseFloat(startAttr) : 20;

            // Get the end position in %
            const endAttr = trigger.getAttribute('data-parallax-end');
            const endVal = endAttr !== null ? parseFloat(endAttr) : -20;

            // Get the start value of the ScrollTrigger
            const scrollStartRaw =
              trigger.getAttribute('data-parallax-scroll-start') ||
              'top bottom';
            const scrollStart = `clamp(${scrollStartRaw})`;

            // Get the end value of the ScrollTrigger
            const scrollEndRaw =
              trigger.getAttribute('data-parallax-scroll-end') || 'bottom top';
            const scrollEnd = `clamp(${scrollEndRaw})`;

            // Get opacity values
            const opacityStartAttr = trigger.getAttribute(
              'data-parallax-opacity-start'
            );
            const opacityEndAttr = trigger.getAttribute(
              'data-parallax-opacity-end'
            );

            const fromVars: any = { [prop]: startVal };
            const toVars: any = {
              [prop]: endVal,
              ease: 'none',
              scrollTrigger: {
                trigger,
                start: scrollStart,
                end: scrollEnd,
                scrub,
              },
            };

            if (opacityStartAttr !== null || opacityEndAttr !== null) {
              fromVars.opacity =
                opacityStartAttr !== null ? parseFloat(opacityStartAttr) : 1;
              toVars.opacity =
                opacityEndAttr !== null ? parseFloat(opacityEndAttr) : 1;
            }

            gsap.fromTo(target, fromVars, toVars);
          });
        });

        return () => ctx.revert();
      }
    );
  };

  const cleanupGlobalParallax = () => {
    if (mm) {
      mm.revert();
      mm = null;
    }
  };

  return {
    initGlobalParallax,
    cleanupGlobalParallax,
  };
};
