<script setup lang="ts">
import type { EntuEntity } from '~/types/entu'

const props = defineProps<{ lp: EntuEntity }>()
const { db } = useDashboard()

const playlist = computed(() => {
  const ref = val(props.lp, 'playlist', 'reference') as string | null
  return ref ? db.value?.playlistById[ref] : undefined
})
</script>

<template>
  <details class="db-card group/lp border-cyan-200 bg-cyan-50">
    <summary class="db-summary">
      <div class="db-header">
        <span class="db-arrow text-cyan-600/70 group-open/lp:rotate-90">›</span>
        <span class="text-cyan-600/70">layout_playlist</span>
        <dashboard-id-link :id="lp._id" />
      </div>
      <span class="db-name text-black">{{ val(lp, 'name') }}</span>
    </summary>

    <dl class="db-props">
      <dt>left</dt>
      <dd>{{ val(lp, 'left', 'number') ?? '—' }}</dd>
      <dt>top</dt>
      <dd>{{ val(lp, 'top', 'number') ?? '—' }}</dd>
      <dt>width</dt>
      <dd>{{ val(lp, 'width', 'number') ?? '—' }}</dd>
      <dt>height</dt>
      <dd>{{ val(lp, 'height', 'number') ?? '—' }}</dd>
      <dt>units</dt>
      <dd>{{ val(lp, 'in_pixels', 'boolean') ? 'px' : '%' }}</dd>
      <dt>zindex</dt>
      <dd>{{ val(lp, 'zindex', 'number') ?? '—' }}</dd>
      <dt>loop</dt>
      <dd>{{ val(lp, 'loop', 'boolean') ? 'true' : 'false' }}</dd>
    </dl>

    <div class="db-children">
      <dashboard-playlist v-if="playlist" :pl="playlist" />
      <div v-else class="db-empty">no playlist linked</div>
    </div>
  </details>
</template>
