<script setup lang="ts">
import type { EntuEntity, EntuFetchResult } from '~/types/entu'

const config = useRuntimeConfig()
const entuBase = `${config.public.entuUrl}/${config.public.entuAccount}`
const entuAppBase = `https://entu.app/${config.public.entuAccount}`

async function entuFetch(type: string, props: string): Promise<EntuEntity[]> {
  const params = new URLSearchParams({ '_type.string': type, props, limit: '9999' })
  try {
    const res = await $fetch<EntuFetchResult>(`${entuBase}/entity?${params}`)
    return res?.entities ?? []
  }
  catch {
    return []
  }
}

function groupBy<T>(arr: T[], keyFn: (item: T) => string | null | boolean | number | undefined): Record<string, T[]> {
  const map: Record<string, T[]> = {}
  for (const item of arr) {
    const k = String(keyFn(item))
    if (k && k !== 'null' && k !== 'undefined') {
      if (!map[k]) map[k] = []
      map[k].push(item)
    }
  }
  return map
}

const { data, pending, error } = useAsyncData('dashboard', async () => {
  const [screenGroups, screens, configs, schedules, layouts, layoutPlaylists, playlists, playlistMedias, medias] = await Promise.all([
    entuFetch('sw_screen_group', 'name.string,published.datetime,configuration.reference'),
    entuFetch('sw_screen', 'name.string,screen_group.reference'),
    entuFetch('sw_configuration', 'name.string,update_interval.number'),
    entuFetch('sw_schedule', 'name.string,_parent.reference,crontab.string,layout.reference,ordinal.number,duration.number,valid_from.datetime,valid_to.datetime,cleanup.boolean'),
    entuFetch('sw_layout', 'name.string,width.number,height.number'),
    entuFetch('sw_layout_playlist', 'name.string,_parent.reference,playlist.reference,left.number,top.number,width.number,height.number,zindex.number,loop.boolean,in_pixels.boolean'),
    entuFetch('sw_playlist', 'name.string,valid_from.datetime,valid_to.datetime'),
    entuFetch('sw_playlist_media', 'name.string,_parent.reference,media.reference,ordinal.number,duration.number,delay.number,valid_from.datetime,valid_to.datetime,mute.boolean,stretch.boolean'),
    entuFetch('sw_media', 'name.string,type.string,file.filename,url.string,valid_from.datetime,valid_to.datetime'),
  ])

  const configById = Object.fromEntries(configs.map(c => [c._id, c]))
  const layoutById = Object.fromEntries(layouts.map(l => [l._id, l]))
  const playlistById = Object.fromEntries(playlists.map(p => [p._id, p]))
  const mediaById = Object.fromEntries(medias.map(m => [m._id, m]))

  const screensByGroup = groupBy(screens, s => val(s, 'screen_group', 'reference'))
  const schedulesByConfig = groupBy(schedules, s => val(s, '_parent', 'reference'))
  const layoutPlaylistsByLayout = groupBy(layoutPlaylists, lp => val(lp, '_parent', 'reference'))
  const playlistMediasByPlaylist = groupBy(playlistMedias, pm => val(pm, '_parent', 'reference'))

  return {
    screenGroups: [...screenGroups].sort((a, b) => {
      const aDate = String(val(a, 'published', 'datetime') ?? '')
      const bDate = String(val(b, 'published', 'datetime') ?? '')
      return bDate.localeCompare(aDate) || byName(a, b)
    }),
    screens: [...screens].sort(byName),
    configs: [...configs].sort(byName),
    schedules: [...schedules].sort(byName),
    layouts: [...layouts].sort(byName),
    layoutPlaylists: [...layoutPlaylists].sort(byName),
    playlists: [...playlists].sort(byName),
    playlistMedias: [...playlistMedias].sort((a, b) => Number(val(a, 'ordinal', 'number') ?? 0) - Number(val(b, 'ordinal', 'number') ?? 0)),
    medias: [...medias].sort(byName),
    configById, layoutById, playlistById, mediaById,
    screensByGroup, schedulesByConfig, layoutPlaylistsByLayout, playlistMediasByPlaylist,
  }
})

provide('db', data)
provide('dbBase', entuAppBase)
</script>

<template>
  <div class="h-full overflow-y-auto bg-white p-6 font-mono text-sm text-black/80">
    <div v-if="pending" class="text-black/40">
      loading from entu…
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ error.message }}
    </div>

    <div v-else-if="data" class="space-y-1">
      <!-- Stats -->
      <div class="mb-4 space-y-0.5 text-black/40">
        <div>screen groups: {{ data.screenGroups.length }}</div>
        <div>screens: {{ data.screens.length }}</div>
        <div>configs: {{ data.configs.length }}</div>
        <div>schedules: {{ data.schedules.length }}</div>
        <div>layouts: {{ data.layouts.length }}</div>
        <div>layout_playlists: {{ data.layoutPlaylists.length }}</div>
        <div>playlists: {{ data.playlists.length }}</div>
        <div>playlist_medias: {{ data.playlistMedias.length }}</div>
        <div>media: {{ data.medias.length }}</div>
      </div>

      <!-- Screen Groups -->
      <DashboardScreenGroup v-for="sg in data.screenGroups" :key="sg._id" :sg="sg" />

      <div v-if="!data.screenGroups.length" class="text-black/40">
        no screen groups found — data may require authentication
      </div>
    </div>
  </div>
</template>
