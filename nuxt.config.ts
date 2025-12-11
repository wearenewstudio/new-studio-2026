import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  experimental: {
    viewTransition: true,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxtjs/sanity', '@nuxt/image', 'nuxt-lottie'],
  css: ['~/assets/css/main.css'],
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'mux-player',
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@sanity/visual-editing'],
    },
  },
  fonts: {
    families: [
      {
        name: 'New Studio Sans',
        provider: 'local',
      },
      {
        name: 'Ubuntu Mono',
        provider: 'local',
      },
    ],
    defaults: {
      preload: true,
      weights: [400],
    },
  },
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2025-01-01',
  },
  image: {
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID as string,
    },
  },
});
