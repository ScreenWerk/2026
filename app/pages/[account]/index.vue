<script setup lang="ts">
import type { EntuEntity, EntuFetchResult } from '~/types/entu'
import { formatTimeAgo, useNow } from '@vueuse/core'

useHead({ title: 'Dashboard · ScreenWerk' })

const route = useRoute()
const account = route.params.account as string

const config = useRuntimeConfig()
const entuBase = `${config.public.entuUrl}/${account}`
const entuAppBase = `https://entu.app/${account}`

async function entuFetch (type: string, props: string): Promise<EntuEntity[]> {
  const params = new URLSearchParams({ '_type.string': type, props, limit: '9999' })
  try {
    const res = await $fetch<EntuFetchResult>(`${entuBase}/entity?${params}`)
    return res?.entities ?? []
  }
  catch {
    return []
  }
}

function groupBy<T> (arr: T[], keyFn: (item: T) => string | null | boolean | number | undefined): Record<string, T[]> {
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
    entuFetch('sw_media', 'name.string,type.string,file.filename,url.string,valid_from.datetime,valid_to.datetime')
  ])

  const configById = Object.fromEntries(configs.map((c) => [c._id, c]))
  const layoutById = Object.fromEntries(layouts.map((l) => [l._id, l]))
  const playlistById = Object.fromEntries(playlists.map((p) => [p._id, p]))
  const mediaById = Object.fromEntries(medias.map((m) => [m._id, m]))

  const screensByGroup = groupBy(screens, (s) => val(s, 'screen_group', 'reference'))
  const schedulesByConfig = groupBy(schedules, (s) => val(s, '_parent', 'reference'))
  const layoutPlaylistsByLayout = groupBy(layoutPlaylists, (lp) => val(lp, '_parent', 'reference'))
  const playlistMediasByPlaylist = groupBy(playlistMedias, (pm) => val(pm, '_parent', 'reference'))

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
    screensByGroup, schedulesByConfig, layoutPlaylistsByLayout, playlistMediasByPlaylist
  }
})

provide('db', data)
provide('dbBase', entuAppBase)

const now = useNow({ interval: 30_000 })

const groupedScreenGroups = computed(() => {
  if (!data.value) return []

  const groups: { label: string, published: string, items: EntuEntity[] }[] = []
  const seen = new Map<string, EntuEntity[]>()

  for (const sg of data.value.screenGroups) {
    const dt = val(sg, 'published', 'datetime') as string | null
    const label = dt ? formatTimeAgo(new Date(dt), { now: now.value }) : 'never'

    if (!seen.has(label)) {
      seen.set(label, [])
      groups.push({ label, published: dt ? String(dt).slice(0, 19).replace('T', ' ') : '', items: seen.get(label)! })
    }

    seen.get(label)!.push(sg)
  }
  return groups
})
</script>

<template>
  <div class="h-full overflow-y-auto overflow-x-hidden bg-white font-mono text-sm text-black/80">
    <div class="container mx-auto flex min-h-full flex-col gap-6 p-6">
      <div class="text-center">
        <div class="text-3xl font-extralight tracking-widest text-black">
          SCREENWERK
        </div>
        <div class="mt-1 text-sm text-black/40">
          {{ account }}
        </div>
      </div>

      <div
        v-if="pending"
        class="fixed inset-0 flex items-center justify-center text-black/40"
      >
        loading from entu…
      </div>

      <div
        v-else-if="error"
        class="fixed inset-0 flex items-center justify-center text-red-500"
      >
        {{ error.message }}
      </div>

      <div
        v-else-if="data"
        class="space-y-6"
      >
        <!-- Stats -->
        <dl
          v-if="data.screenGroups.length"
          class="mx-auto grid w-full grid-cols-[1fr_max-content] gap-x-3 gap-y-0.5 text-black/40 md:w-fit md:grid-cols-[max-content_max-content] [&_dd]:text-right"
        >
          <dt>screen groups</dt><dd>{{ data.screenGroups.length }}</dd>
          <dt>screens</dt><dd>{{ data.screens.length }}</dd>
          <dt>configs</dt><dd>{{ data.configs.length }}</dd>
          <dt>schedules</dt><dd>{{ data.schedules.length }}</dd>
          <dt>layouts</dt><dd>{{ data.layouts.length }}</dd>
          <dt>layout_playlists</dt><dd>{{ data.layoutPlaylists.length }}</dd>
          <dt>playlists</dt><dd>{{ data.playlists.length }}</dd>
          <dt>playlist_medias</dt><dd>{{ data.playlistMedias.length }}</dd>
          <dt>media</dt><dd>{{ data.medias.length }}</dd>
        </dl>

        <!-- Screen Groups -->
        <div class="space-y-4">
          <div
            v-for="group in groupedScreenGroups"
            :key="group.label"
            class="space-y-1"
          >
            <div class="text-xs font-medium uppercase tracking-widest text-black/30">
              {{ `Published ${group.label}` }}
            </div>
            <dashboard-screen-group
              v-for="sg in group.items"
              :key="sg._id"
              :sg="sg"
            />
          </div>

          <div
            v-if="!data.screenGroups.length"
            class="fixed inset-0 flex items-center justify-center text-red-500"
          >
            no screen groups found
          </div>
        </div>
      </div>

      <div class="mt-auto text-center text-xs text-black/20">
        Powered by <a href="https://entu.ee" target="_blank" rel="noopener" class="font-semibold underline decoration-dotted hover:text-black/40">Entu</a>
      </div>
    </div>
  </div>
</template>
