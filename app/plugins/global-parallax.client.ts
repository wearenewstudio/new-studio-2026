/**
 * Plugin to initialize global parallax from data attributes
 * hooks into page:finish to re-initialize on navigation
 */
export default defineNuxtPlugin({
  name: 'global-parallax',
  parallel: true,
  setup(nuxtApp) {
    if (import.meta.server) return;

    const { initGlobalParallax } = useGlobalParallax();

    const initialize = () => {
      if (typeof window !== 'undefined') {
        // Use requestAnimationFrame/setTimeout to ensure DOM is ready
        requestAnimationFrame(() => {
          setTimeout(() => {
            initGlobalParallax();
          }, 100);
        });
      }
    };

    // Initialize on app mount
    nuxtApp.hook('app:mounted', () => {
      initialize();
    });

    // Also initialize on window load
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        initialize();
      } else {
        window.addEventListener('load', () => {
          initialize();
        });
      }
    }

    // Re-initialize on page navigation
    nuxtApp.hook('page:finish', () => {
      initialize();
    });
  },
});

