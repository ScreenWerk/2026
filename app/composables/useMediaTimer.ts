import type { PlaylistMedia } from '~/types'

/**
 * Manages delay and duration timers for media playback.
 * Handles setup, cleanup, and reactivity for media components.
 */
export function useMediaTimer (
  getMedia: () => PlaylistMedia,
  onComplete: () => void
) {
  const runtimeConfig = useRuntimeConfig()
  const defaultDuration = runtimeConfig.public.defaultMediaDurationSeconds as number

  let delayTimer: ReturnType<typeof setTimeout> | null = null
  let durationTimer: ReturnType<typeof setTimeout> | null = null

  // Clear any active timers.
  function clearTimers () {
    if (delayTimer) {
      clearTimeout(delayTimer)
      delayTimer = null
    }

    if (durationTimer) {
      clearTimeout(durationTimer)
      durationTimer = null
    }
  }

  // Start the duration timer to emit completion after duration.
  function startDuration () {
    const media = getMedia()
    durationTimer = setTimeout(onComplete, (media.duration ?? defaultDuration) * 1000)
  }

  // Setup timers: delay then duration.
  function setup () {
    clearTimers()

    const media = getMedia()
    const delay = media.delay ?? 0

    delayTimer = delay > 0
      ? setTimeout(startDuration, delay * 1000)
      : (startDuration(), null)
  }

  // React to media changes.
  watch(() => getMedia().playlistMediaEid, setup)

  onMounted(setup)

  onBeforeUnmount(clearTimers)

  return { setup, clearTimers }
}
