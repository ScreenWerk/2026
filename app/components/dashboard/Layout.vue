<script setup lang="ts">
import type { EntuEntity } from '~/types/entu'

const props = defineProps<{ layout: EntuEntity }>()
const { db } = useDashboard()

const layoutPlaylists = computed(() =>
  [...(db.value?.layoutPlaylistsByLayout[props.layout._id] ?? [])].sort(byName)
)
</script>

<template>
  <details class="db-card group/lay border-lime-200 bg-lime-50">
    <summary class="db-summary">
      <span class="db-arrow text-lime-600/70 group-open/lay:rotate-90">›</span>
      <span class="text-lime-600/70">layout</span>
      <span class="text-black">{{ val(layout, 'name') }}</span>
      <DashboardIdLink :id="layout._id" />
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
