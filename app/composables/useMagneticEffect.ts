/**
 * Composable for magnetic button effect using GSAP
 * Handles only the magnetic movement effect (button following mouse cursor)
 * Automatically initializes magnetic effect based on data attributes in the DOM
 * Note: This does not handle text animations - those should be handled separately via CSS if needed
 */
export const useMagneticEffect = () => {
  const { $gsap } = useNuxtApp();
  const gsap = $gsap as typeof import('gsap').gsap;

  // Track initialized elements to prevent duplicate listeners
  const initializedElements = new WeakSet<HTMLElement>();

  /**
   * Initialize magnetic effect on all elements with [data-magnetic-strength] attribute
   */
  const initMagneticEffect = () => {
    if (import.meta.server || (typeof window !== 'undefined' && window.innerWidth <= 991))
      return;

    if (!gsap) {
      console.warn('GSAP is not available. Magnetic effect will not work.');
      return;
    }

    const magnets = document.querySelectorAll<HTMLElement>(
      '[data-magnetic-strength]'
    );

    if (!magnets.length) return;

    // Helper to kill tweens and reset an element
    const resetEl = (el: HTMLElement | null, immediate = false) => {
      if (!el) return;

      gsap.killTweensOf(el);
      (immediate ? gsap.set : gsap.to)(el, {
        x: '0em',
        y: '0em',
        rotate: '0deg',
        clearProps: 'all',
        ...(!immediate && { ease: 'elastic.out(1, 0.3)', duration: 1.6 }),
      });
    };

    const resetOnEnter = (e: MouseEvent) => {
      const m = e.currentTarget as HTMLElement;
      resetEl(m, true);
      resetEl(
        m.querySelector<HTMLElement>('[data-magnetic-inner-target]'),
        true
      );
    };

    const moveMagnet = (e: MouseEvent) => {
      const m = e.currentTarget as HTMLElement;
      const b = m.getBoundingClientRect();
      const strength =
        parseFloat(m.getAttribute('data-magnetic-strength') || '25') || 25;
      const inner = m.querySelector<HTMLElement>('[data-magnetic-inner-target]');
      const innerStrength =
        parseFloat(m.getAttribute('data-magnetic-strength-inner') || String(strength)) ||
        strength;

      const offsetX =
        ((e.clientX - b.left) / m.offsetWidth - 0.5) * (strength / 16);
      const offsetY =
        ((e.clientY - b.top) / m.offsetHeight - 0.5) * (strength / 16);

      gsap.to(m, {
        x: offsetX + 'em',
        y: offsetY + 'em',
        rotate: '0.001deg',
        ease: 'power4.out',
        duration: 1.6,
      });

      if (inner) {
        const innerOffsetX =
          ((e.clientX - b.left) / m.offsetWidth - 0.5) * (innerStrength / 16);
        const innerOffsetY =
          ((e.clientY - b.top) / m.offsetHeight - 0.5) * (innerStrength / 16);

        gsap.to(inner, {
          x: innerOffsetX + 'em',
          y: innerOffsetY + 'em',
          rotate: '0.001deg',
          ease: 'power4.out',
          duration: 2,
        });
      }
    };

    const resetMagnet = (e: MouseEvent) => {
      const m = e.currentTarget as HTMLElement;
      const inner = m.querySelector<HTMLElement>('[data-magnetic-inner-target]');

      gsap.to(m, {
        x: '0em',
        y: '0em',
        ease: 'elastic.out(1, 0.3)',
        duration: 1.6,
        clearProps: 'all',
      });

      if (inner) {
        gsap.to(inner, {
          x: '0em',
          y: '0em',
          ease: 'elastic.out(1, 0.3)',
          duration: 2,
          clearProps: 'all',
        });
      }
    };

    magnets.forEach((m) => {
      // Skip if already initialized
      if (initializedElements.has(m)) return;

      m.addEventListener('mouseenter', resetOnEnter);
      m.addEventListener('mousemove', moveMagnet);
      m.addEventListener('mouseleave', resetMagnet);

      // Mark as initialized
      initializedElements.add(m);
    });
  };

  return {
    initMagneticEffect,
  };
};

