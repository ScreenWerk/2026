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
    <summary class="db-summary">
      <span class="db-arrow group-open/lay:rotate-90">▶</span>
      <span class="text-orange-600/70">layout</span>
      <span class="text-black">{{ val(layout, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${layout._id}`"
        target="_blank"
        class="db-id-link"
        @click.stop
      > {{ layout._id }}</a>
    </summary>

    <dl class="db-props">
      <dt>width</dt><dd>{{ val(layout, 'width', 'number') ?? '—' }}</dd>
      <dt>height</dt><dd>{{ val(layout, 'height', 'number') ?? '—' }}</dd>
    </dl>

    <div class="db-children">
      <DashboardLayoutPlaylist
        v-for="lp in layoutPlaylists"
        :key="lp._id"
        :lp="lp"
      />
      <div
        v-if="!layoutPlaylists.length"
        class="db-empty"
      >
        no zones
      </div>
    </div>
  </details>
</template>
