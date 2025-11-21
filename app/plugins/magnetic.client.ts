/**
 * Plugin to initialize magnetic effect from data attributes
 * This allows you to use the original HTML data-attribute approach
 * The initialization happens after the app is mounted and on page navigation
 * Note: This plugin only handles magnetic movement effects, not text animations
 */
export default defineNuxtPlugin({
  name: 'magnetic-effect',
  parallel: true,
  setup(nuxtApp) {
    if (import.meta.server) return;

    const { initMagneticEffect } = useMagneticEffect();

    // Initialize magnetic elements
    const initializeMagnetic = () => {
      if (typeof window !== 'undefined') {
        // Use nextTick to ensure DOM is ready
        nextTick(() => {
          initMagneticEffect();
        });
      }
    };

    // Initialize on app mount
    nuxtApp.hook('app:mounted', () => {
      initializeMagnetic();
    });

    // Re-initialize on page navigation
    nuxtApp.hook('page:finish', () => {
      initializeMagnetic();
    });
  },
});

