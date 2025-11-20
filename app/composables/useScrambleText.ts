export type ScrambleChars = 'upperCase' | string;

interface ScrambleOptions {
  chars?: ScrambleChars;
  duration?: number;
  stagger?: number;
  speed?: number;
  customHoverText?: string;
}

/**
 * Composable for scramble text functionality using GSAP
 * Automatically initializes scramble text based on data attributes in the DOM
 * Requires GSAP premium plugins: ScrambleTextPlugin and SplitText
 */
export const useScrambleText = () => {
  const { $gsap, $ScrollTrigger, $ScrambleTextPlugin, $SplitText } =
    useNuxtApp();

  const gsap = $gsap as typeof import('gsap').gsap;
  const ScrollTrigger =
    $ScrollTrigger as typeof import('gsap/ScrollTrigger').ScrollTrigger;
  const ScrambleTextPlugin = $ScrambleTextPlugin as any;
  const SplitText = $SplitText as any;

  /**
   * Initialize scramble text on load
   */
  const initScrambleOnLoad = (
    target: HTMLElement,
    options?: ScrambleOptions
  ) => {
    if (!SplitText || !ScrambleTextPlugin) {
      console.warn('SplitText or ScrambleTextPlugin not available');
      return;
    }

    const split = new SplitText(target, {
      type: 'words, chars',
      wordsClass: 'word',
      charsClass: 'char',
    });

    gsap.to(split.words, {
      duration: options?.duration || 1.2,
      stagger: options?.stagger || 0.01,
      scrambleText: {
        text: '{original}',
        chars: options?.chars || 'upperCase',
        speed: options?.speed || 0.85,
      },
      onComplete: () => split.revert(),
    });
  };

  /**
   * Initialize scramble text on scroll
   */
  const initScrambleOnScroll = (
    target: HTMLElement,
    options?: ScrambleOptions
  ) => {
    if (!SplitText || !ScrambleTextPlugin) {
      console.warn('SplitText or ScrambleTextPlugin not available');
      return;
    }

    const split = new SplitText(target, {
      type: 'words, chars',
      wordsClass: 'word',
      charsClass: 'char',
    });

    gsap.to(split.words, {
      duration: options?.duration || 1.4,
      stagger: options?.stagger || 0.015,
      scrambleText: {
        text: '{original}',
        chars: options?.chars || 'upperCase',
        speed: options?.speed || 0.95,
      },
      scrollTrigger: {
        trigger: target,
        start: 'top bottom',
        once: true,
      },
      onComplete: () => split.revert(),
    });
  };

  /**
   * Initialize scramble text on hover
   * Creates a new overlay span for the scramble animation and sets original text to opacity 0
   */
  const initScrambleOnHover = (
    target: HTMLElement,
    textElement: HTMLElement,
    options?: ScrambleOptions
  ) => {
    if (!SplitText || !ScrambleTextPlugin) {
      console.warn('SplitText or ScrambleTextPlugin not available');
      return;
    }

    const originalText = textElement.textContent || '';
    const customHoverText = options?.customHoverText || originalText;

    // Ensure text element has relative positioning for absolute children
    const computedStyle = window.getComputedStyle(textElement);
    const originalDisplay = computedStyle.display;
    if (computedStyle.position === 'static') {
      textElement.style.position = 'relative';
    }
    // Preserve original display, but ensure it can contain absolute children
    if (originalDisplay === 'inline') {
      textElement.style.display = 'inline-block';
    }

    // Wrap the original text content in a span that maintains layout
    const originalTextSpan = document.createElement('span');
    originalTextSpan.className = 'anim-text-original';
    originalTextSpan.style.cssText = 'display: inline-block;';
    originalTextSpan.textContent = originalText;

    // Create overlay span for scramble animation
    // Position it absolutely to match the original text exactly
    // Start empty and invisible - will be populated by scramble animation
    const animTextSpan = document.createElement('span');
    animTextSpan.className = 'anim-text';
    animTextSpan.style.cssText =
      'position: absolute; top: 0; left: 0; display: inline-block; pointer-events: none; opacity: 0;';

    // Replace textElement content with both spans
    textElement.textContent = '';
    textElement.appendChild(originalTextSpan);
    textElement.appendChild(animTextSpan);

    let tl: ReturnType<typeof gsap.timeline> | null = null;

    const handleMouseEnter = () => {
      tl = gsap.timeline();

      // Set original text to opacity 0 (maintains layout space)
      tl.set(originalTextSpan, { opacity: 0 }, 0);

      // Show overlay and animate scramble
      tl.set(animTextSpan, { opacity: 1 }, 0);
      tl.to(
        animTextSpan,
        {
          duration: 1,
          scrambleText: {
            text: customHoverText,
            chars:
              options?.chars ||
              'abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:"',
            speed: 0.1,
          },
        },
        0
      );
    };

    const handleMouseLeave = () => {
      // Revert the timeline to restore original state
      if (tl) {
        tl.revert();
        tl = null;
      }
    };

    target.addEventListener('mouseenter', handleMouseEnter);
    target.addEventListener('mouseleave', handleMouseLeave);

    // Return cleanup function
    return () => {
      target.removeEventListener('mouseenter', handleMouseEnter);
      target.removeEventListener('mouseleave', handleMouseLeave);
      // Revert any active timeline
      if (tl) {
        tl.revert();
        tl = null;
      }
      // Restore original text content
      textElement.textContent = originalText;
    };
  };

  /**
   * Initialize all scramble text elements based on data attributes
   * This matches the original vanilla JS implementation
   * Prevents double initialization by checking for existing data attribute
   */
  const initScrambleFromDataAttributes = () => {
    if (import.meta.server) return;
    if (!SplitText || !ScrambleTextPlugin) {
      console.warn('SplitText or ScrambleTextPlugin not available');
      return;
    }

    // Initialize scramble on load (only if not already initialized)
    const loadTargets = document.querySelectorAll<HTMLElement>(
      '[data-scramble="load"]:not([data-scramble-initialized])'
    );
    loadTargets.forEach(target => {
      target.setAttribute('data-scramble-initialized', 'true');
      initScrambleOnLoad(target);
    });

    // Initialize scramble on scroll (only if not already initialized)
    const scrollTargets = document.querySelectorAll<HTMLElement>(
      '[data-scramble="scroll"]:not([data-scramble-initialized])'
    );
    scrollTargets.forEach(target => {
      target.setAttribute('data-scramble-initialized', 'true');
      const isAlternative = target.hasAttribute('data-scramble-alt');
      initScrambleOnScroll(target, {
        chars: isAlternative ? '▯|' : 'upperCase',
      });
    });

    // Initialize scramble on hover (only if not already initialized)
    const hoverTargets = document.querySelectorAll<HTMLElement>(
      '[data-scramble-hover="link"]:not([data-scramble-initialized])'
    );
    hoverTargets.forEach(target => {
      target.setAttribute('data-scramble-initialized', 'true');
      const textEl = target.querySelector<HTMLElement>(
        '[data-scramble-hover="target"]'
      );
      if (textEl) {
        const originalText = textEl.textContent || '';
        const customHoverText = textEl.getAttribute('data-scramble-text') || '';
        initScrambleOnHover(target, textEl, {
          customHoverText: customHoverText || originalText,
        });
      }
    });
  };

  return {
    initScrambleFromDataAttributes,
  };
};
