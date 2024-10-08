// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  experimental: {
    typedPages: true
  },
  nitro: {
    experimental: {
      websocket: true
    }
  },
  plugins: [
    {
      src: '@@/plugins/msw',
      mode: "client"
    }
  ],
  modules: [
    '@vueuse/nuxt',
  ],
})
