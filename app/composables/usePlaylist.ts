import type { LayoutPlaylist, PlaylistMedia } from '~/types'

/**
 * Manages playlist playback state for a single layoutPlaylist.
 *
 * Accepts getter functions — the Vue 3.5+/4 idiomatic composable API.
 * Getters called inside computed/watch are tracked reactively.
 *
 * - Filters playlistMedias by validFrom/validTo (reacts to getNow)
 * - Sorts by ordinal
 * - Advances through items; loops if layoutPlaylist.loop, otherwise holds last frame
 * - Resets to 0 on new cron tick when cleanup is enabled
 * - Resets to 0 when the layoutPlaylist eid changes (schedule switch)
 */
export function usePlaylist(
  getLayoutPlaylist: () => LayoutPlaylist,
  getCleanup: () => boolean,
  getLastCronTick: () => Date,
  getNow: () => Date
) {
  const index = ref(0)
  const prevTickMs = ref(getLastCronTick().getTime())

  // Filter and sort playlistMedias by validity window.
  const validMedias = computed<PlaylistMedia[]>(() => {
    const t = getNow()

    return getLayoutPlaylist()
      .playlistMedias.filter((m) => isWithinValidityWindow(m, t))
      .sort((a, b) => a.ordinal - b.ordinal)
  })

  // Return the current media at the current index.
  const currentMedia = computed<PlaylistMedia | null>(() => {
    const medias = validMedias.value

    if (!medias.length) return null

    return medias[Math.min(index.value, medias.length - 1)] ?? null
  })

  // Reset index when cleanup is enabled and a new cron tick occurs.
  watch(getLastCronTick, (tick) => {
    if (getCleanup() && tick.getTime() !== prevTickMs.value) {
      index.value = 0
      prevTickMs.value = tick.getTime()
    }
  })

  // Reset index when the layoutPlaylist changes (schedule switch).
  watch(
    () => getLayoutPlaylist().eid,
    () => {
      index.value = 0
    }
  )

  // Increments on every advance() to force media component remount via :key.
  const playKey = ref(0)

  // Advance to the next media in the playlist.
  function advance() {
    const len = validMedias.value.length
    if (!len) return

    const next = index.value + 1

    index.value = next >= len ? (getLayoutPlaylist().loop ? 0 : len - 1) : next

    playKey.value++
  }

  return { currentMedia, advance, playKey }
}
