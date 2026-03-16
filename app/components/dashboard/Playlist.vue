<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ pl: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const mediaItems = computed(() => db.value?.playlistMediasByPlaylist[props.pl._id] ?? [])
</script>

<template>
  <details class="group/pl border border-teal-200 rounded bg-teal-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/pl:rotate-90">▶</span>
      <span class="text-teal-600/70">playlist</span>
      <span class="text-black">{{ val(pl, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${pl._id}`"
        target="_blank"
        class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
        @click.stop
      > {{pl._id }}</a>
    </summary>

    <div class="space-y-0.5 pl-5 pt-0.5 pb-1 text-black/60">
      <div>valid_from: {{ val(pl, 'valid_from') ?? '—' }}</div>
      <div>valid_to: {{ val(pl, 'valid_to') ?? '—' }}</div>
    </div>

    <div class="ml-3 mt-1 space-y-1 pl-3">
      <details class="group/mi border border-cyan-200 rounded bg-cyan-50 px-3 py-2">
        <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
          <span class="w-3 shrink-0 text-black/40 transition-transform group-open/mi:rotate-90">▶</span>
          <span class="text-cyan-700/70">playlist_medias</span>
          <span class="text-black/40">({{ mediaItems.length }})</span>
        </summary>
        <div class="ml-3 mt-1 space-y-1 pl-3">
          <DashboardPlaylistMedia v-for="pm in mediaItems" :key="pm._id" :pm="pm" />
          <div v-if="!mediaItems.length" class="py-0.5 text-black/40">
            no media items
          </div>
        </div>
      </details>
    </div>
  </details>
</template>
