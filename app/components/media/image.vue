<script setup lang="ts">
import type { PlaylistMedia } from '~/types'

const props = defineProps<{ media: PlaylistMedia }>()
const emit = defineEmits<{ ended: [] }>()

// Computed file URL from media.
const src = computed(() => props.media.file)

// Object-fit value: 'fill' if stretch, otherwise 'contain'.
const objectFit = computed(() => (props.media.stretch ? 'fill' : 'contain'))

useMediaTimer(
  () => props.media,
  () => emit('ended')
)
</script>

<template>
  <img
    :src="src"
    :width="media.width"
    :height="media.height"
    :style="{ objectFit }"
    class="absolute inset-0 size-full"
    @error="() => console.warn('[image] load error', src)"
  />
</template>
