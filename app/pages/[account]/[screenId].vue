<script setup lang="ts">
const route = useRoute()
const screenId = computed(() => route.params.screenId as string)

useHead({ title: 'Player · ScreenWerk' })

const {
  screenConfig,
  activeSchedule,
  lastCronTick,
  now,
  validLayoutPlaylists,
  scheduleStyle
} = useScreen(() => screenId.value)
</script>

<template>
  <div class="relative size-full overflow-hidden">
    <!-- CSS scale applied when schedule defines a fixed canvas size -->
    <div
      v-if="activeSchedule && screenConfig"
      :style="scheduleStyle"
      class="absolute inset-0"
    >
      <layout-playlist
        v-for="layoutPlaylist in validLayoutPlaylists"
        :key="layoutPlaylist.eid"
        :layout-playlist="layoutPlaylist"
        :cleanup="activeSchedule.cleanup"
        :last-cron-tick="lastCronTick"
        :now="now"
        :configuration-eid="screenConfig.configurationEid"
        :screen-eid="screenConfig.screenEid"
        :screen-group-eid="screenConfig.screenGroupEid"
        :schedule-eid="activeSchedule.eid"
      />
    </div>

    <!-- Status indicator: visible only when no layout playlists are playing -->
    <div
      v-if="!validLayoutPlaylists.length"
      class="pointer-events-none absolute bottom-4 right-4 select-none font-mono text-xs text-white/20"
    >
      <div>{{ screenId }}</div>
      <div v-if="screenConfig">updated {{ screenConfig.publishedAt }}</div>
      <div v-else>loading...</div>
    </div>
  </div>
</template>
