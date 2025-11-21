interface HighlightTextOptions {
  scrollStart?: string;
  scrollEnd?: string;
  fadedValue?: number;
  staggerValue?: number;
}

/**
 * Composable for highlight text on scroll functionality using GSAP
 * Automatically initializes highlight text animation based on data attributes in the DOM
 * Requires GSAP premium plugins: ScrollTrigger and SplitText
 *
 * Usage:
 * <h1 data-highlight-text>Your heading here</h1>
 *
 * Optional attributes:
 * - data-highlight-scroll-start: Start position (default: "top 90%")
 * - data-highlight-scroll-end: End position (default: "center 40%")
 * - data-highlight-fade: Opacity of faded letters (default: 0.2)
 * - data-highlight-stagger: Stagger between letters (default: 0.1)
 */
export const useHighlightText = () => {
  const { $gsap, $ScrollTrigger, $SplitText } = useNuxtApp();

  const gsap = $gsap as typeof import('gsap').gsap;
  const ScrollTrigger =
    $ScrollTrigger as typeof import('gsap/ScrollTrigger').ScrollTrigger;
  const SplitText = $SplitText as any;

  /**
   * Initialize highlight text animation for a single element
   */
  const initHighlightTextElement = (
    heading: HTMLElement,
    options?: HighlightTextOptions
  ) => {
    if (!SplitText || !ScrollTrigger) {
      console.warn('SplitText or ScrollTrigger not available');
      return;
    }

    const scrollStart = options?.scrollStart || 'top 90%';
    const scrollEnd = options?.scrollEnd || 'center 40%';
    const fadedValue = options?.fadedValue ?? 0.2;
    const staggerValue = options?.staggerValue ?? 0.1;

    const split = new SplitText(heading, {
      type: 'words, chars',
      autoSplit: true,
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          scrub: true,
          trigger: heading,
          start: scrollStart,
          end: scrollEnd,
        },
      });

      tl.from(split.chars, {
        autoAlpha: fadedValue,
        stagger: staggerValue,
        ease: 'linear',
      });
    });

    // Return cleanup function
    return () => {
      ctx.revert();
      split.revert();
    };
  };

  /**
   * Initialize all highlight text elements based on data attributes
   * This matches the original vanilla JS implementation
   * Prevents double initialization by checking for existing data attribute
   */
  const initHighlightTextFromDataAttributes = () => {
    if (import.meta.server) return;
    if (!SplitText || !ScrollTrigger) {
      console.warn('SplitText or ScrollTrigger not available');
      return;
    }

    const splitHeadingTargets = document.querySelectorAll<HTMLElement>(
      '[data-highlight-text]:not([data-highlight-initialized])'
    );

    splitHeadingTargets.forEach(heading => {
      // Mark as initialized to prevent double initialization
      heading.setAttribute('data-highlight-initialized', 'true');

      // Get custom options from data attributes
      const scrollStart =
        heading.getAttribute('data-highlight-scroll-start') || 'top 90%';
      const scrollEnd =
        heading.getAttribute('data-highlight-scroll-end') || 'center 40%';
      const fadedValue = parseFloat(
        heading.getAttribute('data-highlight-fade') || '0.2'
      );
      const staggerValue = parseFloat(
        heading.getAttribute('data-highlight-stagger') || '0.1'
      );

      initHighlightTextElement(heading, {
        scrollStart,
        scrollEnd,
        fadedValue,
        staggerValue,
      });
    });
  };

  return {
    initHighlightTextFromDataAttributes,
    initHighlightTextElement,
  };
};
