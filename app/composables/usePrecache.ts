import type { ScreenConfig } from '~/types'

/**
 * Proactively caches all media files from a screen config into the Cache API.
 * Removes files no longer referenced. Best-effort — failures are silently ignored.
 */
export async function precacheMedia(cfg: ScreenConfig) {
  if (!('caches' in window)) return

  const runtimeConfig = useRuntimeConfig()
  const batchSize = runtimeConfig.public.precacheBatchSize as number

  try {
    const cache = await caches.open('sw-media')

    const urls = cfg.schedules
      .flatMap((s) => s.layoutPlaylists)
      .flatMap((z) => z.playlistMedias)
      .map((m) => m.file)
      .filter((u): u is string => !!u)

    const unique = new Set(urls)

    // Remove stale cached files no longer in config.
    const cachedKeys = await cache.keys()
    const stale = cachedKeys.filter((req) => !unique.has(req.url))

    if (stale.length) {
      console.log('[precache] removing', stale.length, 'stale files')

      await Promise.all(
        stale.map((req) => {
          console.log('[precache] removed', req.url)

          return cache.delete(req)
        })
      )
    }

    // Fetch missing files not yet in cache.
    const missing = (
      await Promise.all(
        [...unique].map(async (u) =>
          (await cache.match(u, { ignoreVary: true })) ? null : u
        )
      )
    ).filter((u): u is string => u !== null)

    if (!missing.length) {
      console.log('[precache] all', unique.size, 'files already cached')

      return
    }

    console.log(
      '[precache]',
      missing.length,
      'of',
      unique.size,
      'files to cache'
    )

    let done = 0

    for (let i = 0; i < missing.length; i += batchSize) {
      await Promise.allSettled(
        missing.slice(i, i + batchSize).map((url) =>
          fetch(url, { mode: 'cors', credentials: 'omit' })
            .then((r) => {
              if (r.ok) {
                console.log(`[precache] ${++done} of ${missing.length}`, url)

                return cache.put(url, r)
              } else {
                console.warn('[precache] failed', r.status, url)
              }
            })
            .catch((e) => console.warn('[precache] error', url, e))
        )
      )
    }

    console.log('[precache] done')
  } catch {
    // Best-effort pre-caching — ignore failures silently.
  }
}
