<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ pl: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const mediaItems = computed(() => [...(db.value?.playlistMediasByPlaylist[props.pl._id] ?? [])].sort(byOrdinal))
</script>

<template>
  <details class="group/pl border border-blue-200 rounded bg-blue-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/pl:rotate-90">▶</span>
      <span class="text-blue-600/70">playlist</span>
      <span class="text-black">{{ val(pl, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${pl._id}`"
        target="_blank"
        class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
        @click.stop
      > {{pl._id }}</a>
    </summary>

    <dl class="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 pl-5 pt-0.5 pb-1 text-black/60">
      <dt>valid_from</dt><dd>{{ val(pl, 'valid_from') ?? '—' }}</dd>
      <dt>valid_to</dt><dd>{{ val(pl, 'valid_to') ?? '—' }}</dd>
    </dl>

    <div class="ml-3 mt-1 space-y-1 pl-3">
      <DashboardPlaylistMedia v-for="pm in mediaItems" :key="pm._id" :pm="pm" />
      <div v-if="!mediaItems.length" class="py-0.5 text-black/40">
        no media items
      </div>
    </div>
  </details>
</template>
