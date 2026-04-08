<script setup lang="ts">
import type { PlaylistMedia } from '~/types'

const props = defineProps<{ media: PlaylistMedia }>()
const emit = defineEmits<{ ended: [] }>()

// Computed URL from media.
const src = computed(() => props.media.url)

useMediaTimer(
  () => props.media,
  () => emit('ended')
)
</script>

<template>
  <iframe
    :src="src"
    class="absolute inset-0 size-full border-0"
    sandbox="allow-scripts allow-same-origin"
  />
</template>
