<script setup lang="ts">
import type { PlaylistMedia } from '~/types'

const props = defineProps<{ media: PlaylistMedia }>()
const emit = defineEmits<{ ended: [] }>()

const videoEl = ref<HTMLVideoElement | null>(null)

// Computed file URL from media.
const src = computed(() => props.media.file)

// Object-fit value: 'fill' if stretch, otherwise 'contain'.
const objectFit = computed(() => props.media.stretch ? 'fill' : 'contain')

useMediaPlayback(
  videoEl,
  () => props.media,
  (e) => console.warn('[video] play() failed', props.media.file, e)
)
</script>

<template>
  <video
    ref="videoEl"
    :src="src"
    :width="media.width"
    :height="media.height"
    :muted="media.mute"
    :style="{ objectFit }"
    class="absolute inset-0 size-full"
    crossorigin="anonymous"
    playsinline
    @ended="emit('ended')"
    @error="(e) => console.warn('[video] load error', src, (e.target as HTMLVideoElement)?.error)"
  />
</template>
