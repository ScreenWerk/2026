<script setup lang="ts">
import type { EntuEntity } from '~/types/entu'

const props = defineProps<{ pl: EntuEntity }>()
const { db } = useDashboard()

const mediaItems = computed(() => [...(db.value?.playlistMediasByPlaylist[props.pl._id] ?? [])].sort(byOrdinal))
</script>

<template>
  <details class="db-card group/pl border-blue-200 bg-blue-50">
    <summary class="db-summary">
      <span class="db-arrow text-blue-600/70 group-open/pl:rotate-90">›</span>
      <span class="text-blue-600/70">playlist</span>
      <span class="text-black">{{ val(pl, 'name') }}</span>
      <dashboard-id-link :id="pl._id" />
    </summary>

    <dl class="db-props">
      <dt>valid_from</dt><dd>{{ val(pl, 'valid_from') ?? '—' }}</dd>
      <dt>valid_to</dt><dd>{{ val(pl, 'valid_to') ?? '—' }}</dd>
    </dl>

    <div class="db-children">
      <dashboard-playlist-media
        v-for="pm in mediaItems"
        :key="pm._id"
        :pm="pm"
      />
      <div
        v-if="!mediaItems.length"
        class="db-empty"
      >
        no media items
      </div>
    </div>
  </details>
</template>
