import type { RouterConfig } from '@nuxt/schema';

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();

    // If there is a saved position (back/forward navigation), restore it
    if (savedPosition) {
      return new Promise(resolve => {
        nuxtApp.hooks.hookOnce('page:finish', () => {
          // Use a small timeout to ensure the page layout is stable
          setTimeout(() => resolve(savedPosition), 50);
        });
      });
    }

    // If there is a hash (anchor link), scroll to it
    if (to.hash) {
      return new Promise(resolve => {
        nuxtApp.hooks.hookOnce('page:finish', () => {
          setTimeout(() => {
            resolve({
              el: to.hash,
              behavior: 'smooth',
            });
          }, 50);
        });
      });
    }

    // Default: Scroll to top
    return { top: 0 };
  },
};
