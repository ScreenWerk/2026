const apiBase = (process.env.NUXT_PUBLIC_API_BASE || 'https://files.screenwerk.ee').replace(/\/$/, '')
const entuUrl = (process.env.NUXT_PUBLIC_ENTU_URL || 'https://entu.app/api').replace(/\/$/, '')
const entuAccount = process.env.NUXT_PUBLIC_ENTU_ACCOUNT || 'piletilevi'
const escapedBase = apiBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt'
  ],

  ssr: false,

  app: {
    head: {
      title: 'ScreenWerk Player',
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ],
      script: [
        { src: 'https://analytics.entu.dev/ea.min.js', 'data-site': 'screenwerk.ee', crossorigin: 'anonymous', defer: true }
      ]
    }
  },

  spaLoadingTemplate: false,

  runtimeConfig: {
    public: {
      apiBase,
      entuUrl,
      entuAccount,
      clockIntervalSeconds: 30,
      defaultUpdateIntervalMinutes: 10,
      defaultMediaDurationSeconds: 10,
      precacheBatchSize: 3
    }
  },

  vite: {
    optimizeDeps: {
      include: ['cron-parser']
    }
  },

  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Screenwerk Player',
      short_name: 'SW Player',
      display: 'fullscreen',
      background_color: '#000000',
      theme_color: '#000000',
      icons: [
        { src: '/icon.png', sizes: '192x192', type: 'image/png' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,ico,png}'],
      globIgnores: ['**/_payload.json', '**/404*', '**/200*'],
      runtimeCaching: [
        {
          // Config JSON: NetworkFirst to pick up updates, fall back offline.
          urlPattern: new RegExp(`${escapedBase}/screen/.+\\.json$`),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'sw-configs',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7
            },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          // Media files: CacheFirst to serve from cache, warm up proactively.
          urlPattern: new RegExp(`${escapedBase}/media/.+`),
          handler: 'CacheFirst',
          options: {
            cacheName: 'sw-media',
            expiration: {
              maxEntries: 500,
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            cacheableResponse: { statuses: [0, 200] },
            rangeRequests: true, // Required for <video> byte-range requests offline.
            matchOptions: { ignoreVary: true } // Match manually pre-cached entries regardless of Vary.
          }
        }
      ]
    }
  },

  tailwindcss: {
    configPath: '.config/tailwind.config.ts'
  }
})
