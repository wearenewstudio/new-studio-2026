/**
 * Plugin to initialize highlight text animations from data attributes
 * This allows you to use the data-attribute approach without any JS in components
 * The initialization happens after the app is mounted and on page navigation
 */
export default defineNuxtPlugin({
  name: 'highlight-text',
  parallel: true,
  setup(nuxtApp) {
    if (import.meta.server) return;

    const { initHighlightTextFromDataAttributes } = useHighlightText();

    // Initialize highlight text elements
    const initializeHighlightText = () => {
      if (typeof window !== 'undefined') {
        // Use nextTick to ensure DOM is ready
        nextTick(() => {
          initHighlightTextFromDataAttributes();
        });
      }
    };

    // Initialize on app mount
    nuxtApp.hook('app:mounted', () => {
      initializeHighlightText();
    });

    // Re-initialize on page navigation
    nuxtApp.hook('page:finish', () => {
      initializeHighlightText();
    });
  },
});
