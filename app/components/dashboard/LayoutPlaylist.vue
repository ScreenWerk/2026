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
  <details class="group/lp rounded border border-pink-200 bg-pink-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-start gap-2 rounded py-0.5 pr-2 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/lp:rotate-90">▶</span>
      <span class="text-pink-600/70">layout_playlist</span>
      <span class="text-black">{{ val(lp, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${lp._id}`"
        target="_blank"
        class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
        @click.stop
      > {{ lp._id }}</a>
    </summary>

    <dl class="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 pb-1 pl-5 pt-0.5 text-black/60">
      <dt>left</dt><dd>{{ val(lp, 'left', 'number') ?? '—' }}</dd>
      <dt>top</dt><dd>{{ val(lp, 'top', 'number') ?? '—' }}</dd>
      <dt>width</dt><dd>{{ val(lp, 'width', 'number') ?? '—' }}</dd>
      <dt>height</dt><dd>{{ val(lp, 'height', 'number') ?? '—' }}</dd>
      <dt>units</dt><dd>{{ val(lp, 'in_pixels', 'boolean') ? 'px' : '%' }}</dd>
      <dt>zindex</dt><dd>{{ val(lp, 'zindex', 'number') ?? '—' }}</dd>
      <dt>loop</dt><dd>{{ val(lp, 'loop', 'boolean') ? 'true' : 'false' }}</dd>
    </dl>

    <div class="ml-5 mt-1 space-y-1">
      <DashboardPlaylist
        v-if="playlist"
        :pl="playlist"
      />
      <div
        v-else
        class="py-0.5 text-black/40"
      >
        no playlist linked
      </div>
    </div>
  </details>
</template>
