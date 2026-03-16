<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ lp: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const playlist = computed(() => {
  const ref = val(props.lp, 'playlist', 'reference') as string | null
  return ref ? db.value?.playlistById[ref] : undefined
})
</script>

<template>
  <details class="group/lp border border-pink-200 rounded bg-pink-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/lp:rotate-90">▶</span>
      <span class="text-pink-600/70">layout_playlist</span>
      <span class="text-black">{{ val(lp, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${lp._id}`"
        target="_blank"
        class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
        @click.stop
      > {{lp._id }}</a>
    </summary>

    <div class="space-y-0.5 pl-5 pt-0.5 pb-1 text-black/60">
      <div>left: {{ val(lp, 'left', 'number') ?? '—' }}</div>
      <div>top: {{ val(lp, 'top', 'number') ?? '—' }}</div>
      <div>width: {{ val(lp, 'width', 'number') ?? '—' }}</div>
      <div>height: {{ val(lp, 'height', 'number') ?? '—' }}</div>
      <div>units: {{ val(lp, 'in_pixels', 'boolean') ? 'px' : '%' }}</div>
      <div>zindex: {{ val(lp, 'zindex', 'number') ?? '—' }}</div>
      <div>loop: {{ val(lp, 'loop', 'boolean') ? 'true' : 'false' }}</div>
    </div>

    <div class="ml-3 mt-1 space-y-1 pl-3">
      <DashboardPlaylist v-if="playlist" :pl="playlist" />
      <div v-else class="py-0.5 text-black/40">
        no playlist linked
      </div>
    </div>
  </details>
</template>
