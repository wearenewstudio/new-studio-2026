/**
 * Plugin to initialize footer parallax from data attributes
 * This allows you to use the original HTML data-attribute approach
 * The initialization happens after the app is mounted and on page navigation
 */
export default defineNuxtPlugin({
  name: 'footer-parallax',
  parallel: true,
  setup(nuxtApp) {
    if (import.meta.server) return;

    const { initFooterParallax } = useFooterParallax();

    // Initialize footer parallax elements
    const initializeFooterParallax = () => {
      if (typeof window !== 'undefined') {
        // Use requestAnimationFrame to ensure DOM and GSAP are fully ready
        requestAnimationFrame(() => {
          setTimeout(() => {
            initFooterParallax();
          }, 100);
        });
      }
    };

    // Initialize on app mount
    nuxtApp.hook('app:mounted', () => {
      initializeFooterParallax();
    });

    // Also initialize on window load (similar to DOMContentLoaded)
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        initializeFooterParallax();
      } else {
        window.addEventListener('load', () => {
          initializeFooterParallax();
        });
      }
    }

    // Re-initialize on page navigation
    nuxtApp.hook('page:finish', () => {
      initializeFooterParallax();
    });
  },
});
