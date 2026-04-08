<script setup lang="ts">
import { MEDIA_TYPES } from '~/types'
import type { LayoutPlaylist } from '~/types'

const {
  layoutPlaylist,
  cleanup,
  lastCronTick,
  now,
  configurationEid,
  screenEid,
  screenGroupEid,
  scheduleEid
} = defineProps<{
  layoutPlaylist: LayoutPlaylist
  cleanup: boolean
  lastCronTick: Date
  now: Date
  configurationEid: string
  screenEid: string
  screenGroupEid: string
  scheduleEid: string
}>()

const { currentMedia, advance, playKey } = usePlaylist(
  () => layoutPlaylist,
  () => cleanup,
  () => lastCronTick,
  () => now
)

// Unit for position/size values: 'px' or '%'.
const unit = computed(() => (layoutPlaylist.inPixels ? 'px' : '%'))

// Position and size styles for the layoutPlaylist container.
const style = computed(() => ({
  position: 'absolute' as const,
  left: `${layoutPlaylist.left}${unit.value}`,
  top: `${layoutPlaylist.top}${unit.value}`,
  width:
    layoutPlaylist.width === 0
      ? '100%'
      : `${layoutPlaylist.width}${unit.value}`,
  height:
    layoutPlaylist.height === 0
      ? '100%'
      : `${layoutPlaylist.height}${unit.value}`,
  zIndex: layoutPlaylist.zindex,
  overflow: 'hidden'
}))

// Unique key for media component remounting.
const mediaKey = computed(() =>
  currentMedia.value
    ? `${currentMedia.value.playlistMediaEid}-${playKey.value}`
    : ''
)

// Skip unknown media types immediately.
watch(
  currentMedia,
  (media) => {
    if (media && !MEDIA_TYPES.includes(media.type)) advance()
  },
  { immediate: true }
)

// Log currently playing media.
watch(
  currentMedia,
  (media) => {
    if (!media || !MEDIA_TYPES.includes(media.type)) return

    console.groupCollapsed(
      '[media]',
      media.mediaEid,
      '-',
      media.type,
      '-',
      media.name
    )
    console.log(media.playlistMediaEid, '- playlistMedia  -', media.name)
    console.log(
      layoutPlaylist.playlistEid,
      '- playlist       -',
      layoutPlaylist.name
    )
    console.log(layoutPlaylist.eid, '- layoutPlaylist -', layoutPlaylist.name)
    console.log(scheduleEid, '- schedule')
    console.log(screenEid, '- screen')
    console.log(screenGroupEid, '- screenGroup')
    console.log(configurationEid, '- configuration')
    console.groupEnd()
  },
  { immediate: true }
)
</script>

<template>
  <div :style="style">
    <template v-if="currentMedia">
      <media-image
        v-if="currentMedia.type === 'Image'"
        :key="mediaKey"
        :media="currentMedia"
        @ended="advance"
      />
      <media-video
        v-else-if="currentMedia.type === 'Video'"
        :key="mediaKey"
        :media="currentMedia"
        @ended="advance"
      />
      <media-audio
        v-else-if="currentMedia.type === 'Audio'"
        :key="mediaKey"
        :media="currentMedia"
        @ended="advance"
      />
      <media-url
        v-else-if="currentMedia.type === 'URL'"
        :key="mediaKey"
        :media="currentMedia"
        @ended="advance"
      />
    </template>
  </div>
</template>
