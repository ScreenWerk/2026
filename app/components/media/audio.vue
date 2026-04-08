<script setup lang="ts">
import type { PlaylistMedia } from '~/types'

const props = defineProps<{ media: PlaylistMedia }>()
const emit = defineEmits<{ ended: [] }>()

const audioEl = ref<HTMLAudioElement | null>(null)

// Computed file URL from media.
const src = computed(() => props.media.file)

useMediaPlayback(
  audioEl,
  () => props.media,
  (e) => console.warn('[audio] play() failed', props.media.file, e)
)
</script>

<template>
  <!-- Audio has no visual — shows black background. -->
  <audio
    ref="audioEl"
    :src="src"
    :muted="media.mute"
    @ended="emit('ended')"
    @error="
      (e) =>
        console.warn(
          '[audio] load error',
          src,
          (e.target as HTMLAudioElement)?.error
        )
    "
  />
</template>
