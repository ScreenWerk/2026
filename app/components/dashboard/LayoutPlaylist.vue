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
    <summary class="db-summary">
      <span class="db-arrow group-open/lp:rotate-90">▶</span>
      <span class="text-pink-600/70">layout_playlist</span>
      <span class="text-black">{{ val(lp, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${lp._id}`"
        target="_blank"
        class="db-id-link"
        @click.stop
      > {{ lp._id }}</a>
    </summary>

    <dl class="db-props">
      <dt>left</dt><dd>{{ val(lp, 'left', 'number') ?? '—' }}</dd>
      <dt>top</dt><dd>{{ val(lp, 'top', 'number') ?? '—' }}</dd>
      <dt>width</dt><dd>{{ val(lp, 'width', 'number') ?? '—' }}</dd>
      <dt>height</dt><dd>{{ val(lp, 'height', 'number') ?? '—' }}</dd>
      <dt>units</dt><dd>{{ val(lp, 'in_pixels', 'boolean') ? 'px' : '%' }}</dd>
      <dt>zindex</dt><dd>{{ val(lp, 'zindex', 'number') ?? '—' }}</dd>
      <dt>loop</dt><dd>{{ val(lp, 'loop', 'boolean') ? 'true' : 'false' }}</dd>
    </dl>

    <div class="db-children">
      <DashboardPlaylist
        v-if="playlist"
        :pl="playlist"
      />
      <div
        v-else
        class="db-empty"
      >
        no playlist linked
      </div>
    </div>
  </details>
</template>
