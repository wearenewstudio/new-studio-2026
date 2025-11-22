/**
 * Plugin to load Unicorn Studio SDK from CDN
 * Makes UnicornStudio available globally
 */
export default defineNuxtPlugin({
  name: 'unicornstudio',
  parallel: true,
  setup() {
    if (import.meta.server) return;

    return new Promise<void>(resolve => {
      // Check if script is already loaded
      if (typeof window !== 'undefined' && (window as any).UnicornStudio) {
        resolve();
        return;
      }

      // Load the script
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.35/dist/unicornStudio.umd.js';
      script.async = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Unicorn Studio SDK');
        resolve(); // Resolve anyway to not block the app
      };
      document.head.appendChild(script);
    });
  },
});
