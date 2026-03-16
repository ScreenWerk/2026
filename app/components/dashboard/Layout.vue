<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ layout: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const layoutPlaylists = computed(() =>
  [...(db.value?.layoutPlaylistsByLayout[props.layout._id] ?? [])].sort(byName)
)
</script>

<template>
  <details class="group/lay rounded border border-orange-200 bg-orange-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-start gap-2 rounded py-0.5 pr-2 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/lay:rotate-90">▶</span>
      <span class="text-orange-600/70">layout</span>
      <span class="text-black">{{ val(layout, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${layout._id}`"
        target="_blank"
        class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
        @click.stop
      > {{ layout._id }}</a>
    </summary>

    <dl class="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 pb-1 pl-5 pt-0.5 text-black/60">
      <dt>width</dt><dd>{{ val(layout, 'width', 'number') ?? '—' }}</dd>
      <dt>height</dt><dd>{{ val(layout, 'height', 'number') ?? '—' }}</dd>
    </dl>

    <div class="ml-5 mt-1 space-y-1">
      <DashboardLayoutPlaylist
        v-for="lp in layoutPlaylists"
        :key="lp._id"
        :lp="lp"
      />
      <div
        v-if="!layoutPlaylists.length"
        class="py-0.5 text-black/40"
      >
        no zones
      </div>
    </div>
  </details>
</template>
