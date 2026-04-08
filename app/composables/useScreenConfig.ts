import type { ScreenConfig } from '~/types'

/**
 * Fetches and normalizes the screen config JSON.
 * - Promotes fileDO (CDN URL) into media.file so downstream only uses media.file
 * - Skips update if publishedAt is unchanged (no-op on identical config)
 * - On network failure, falls back silently (Workbox serves cached config)
 */
export function useScreenConfig(getScreenId: () => string) {
  const runtimeConfig = useRuntimeConfig()
  const apiBase = runtimeConfig.public.apiBase as string

  const screenConfig = ref<ScreenConfig | null>(null)

  // Fetch, normalize, and cache the screen config.
  async function loadConfig() {
    try {
      const url = `${apiBase}/screen/${getScreenId()}.json`
      const data = await $fetch<ScreenConfig>(url)

      // Normalize fileDO into media.file for downstream consistency.
      for (const s of data.schedules) {
        for (const z of s.layoutPlaylists) {
          for (const m of z.playlistMedias) {
            const raw = m as unknown as { fileDO?: string }

            if (raw.fileDO) m.file = raw.fileDO
          }
        }
      }

      if (
        !screenConfig.value ||
        data.publishedAt !== screenConfig.value.publishedAt
      ) {
        screenConfig.value = data
        precacheMedia(data)
      }
    } catch {
      // Network failure — Workbox serves cached config.
    }
  }

  return { screenConfig, loadConfig }
}
