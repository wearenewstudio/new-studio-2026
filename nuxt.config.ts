import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
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
});
