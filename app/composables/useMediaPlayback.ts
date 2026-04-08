import type { PlaylistMedia } from '~/types'
import type { Ref } from 'vue'

/**
 * Manages delayed playback for video/audio elements.
 * Handles setup, cleanup, and reactivity for media playback.
 */
export function useMediaPlayback<T extends HTMLMediaElement>(
  elementRef: Ref<T | null>,
  getMedia: () => PlaylistMedia,
  onPlayError: (error: unknown) => void
) {
  let delayTimer: ReturnType<typeof setTimeout> | null = null

  // Clear any active delay timer.
  function clearTimers() {
    if (delayTimer) {
      clearTimeout(delayTimer)
      delayTimer = null
    }
  }

  // Start playing the media element.
  function play() {
    elementRef.value?.play().catch(onPlayError)
  }

  // Setup playback: load and start play after delay.
  function setup() {
    clearTimers()

    if (elementRef.value) {
      elementRef.value.pause()
      elementRef.value.load()
    }

    const media = getMedia()
    const delay = media.delay ?? 0

    if (delay > 0) {
      delayTimer = setTimeout(play, delay * 1000)
    } else {
      nextTick(play)
    }
  }

  // React to media changes.
  watch(() => getMedia().playlistMediaEid, setup)

  onMounted(setup)

  onBeforeUnmount(clearTimers)

  return { setup, clearTimers, play }
}
