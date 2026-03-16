<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ layout: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const layoutPlaylists = computed(() =>
  [...(db.value?.layoutPlaylistsByLayout[props.layout._id] ?? [])].sort(byName),
)
</script>

<template>
  <details class="group/lay border border-orange-200 rounded bg-orange-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/lay:rotate-90">▶</span>
      <span class="text-orange-600/70">layout</span>
      <span class="text-black">{{ val(layout, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${layout._id}`"
        target="_blank"
        class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
        @click.stop
      > {{layout._id }}</a>
    </summary>

    <div class="space-y-0.5 pl-5 pt-0.5 pb-1 text-black/60">
      <div>width: {{ val(layout, 'width', 'number') ?? '—' }}</div>
      <div>height: {{ val(layout, 'height', 'number') ?? '—' }}</div>
    </div>

    <div class="ml-3 mt-1 space-y-1 pl-3">
      <details class="group/lps border border-pink-200 rounded bg-pink-50 px-3 py-2">
        <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
          <span class="w-3 shrink-0 text-black/40 transition-transform group-open/lps:rotate-90">▶</span>
          <span class="text-pink-600/70">layout_playlists</span>
          <span class="text-black/40">({{ layoutPlaylists.length }})</span>
        </summary>
        <div class="ml-3 mt-1 space-y-1 pl-3">
          <DashboardLayoutPlaylist v-for="lp in layoutPlaylists" :key="lp._id" :lp="lp" />
          <div v-if="!layoutPlaylists.length" class="py-0.5 text-black/40">
            no zones
          </div>
        </div>
      </details>
    </div>
  </details>
</template>
