/**
 * Plugin to initialize scramble text from data attributes
 * This allows you to use the original HTML data-attribute approach
 * The initialization happens after the app is mounted and on page navigation
 */
export default defineNuxtPlugin({
  name: 'scramble-text',
  parallel: true,
  setup(nuxtApp) {
    if (import.meta.server) return;

    const { initScrambleFromDataAttributes } = useScrambleText();

    // Initialize scramble elements
    const initializeScramble = () => {
      if (typeof window !== 'undefined') {
        // Use nextTick to ensure DOM is ready
        nextTick(() => {
          initScrambleFromDataAttributes();
        });
      }
    };

    // Initialize on app mount
    nuxtApp.hook('app:mounted', () => {
      initializeScramble();
    });

    // Re-initialize on page navigation
    nuxtApp.hook('page:finish', () => {
      initializeScramble();
    });
  },
});
