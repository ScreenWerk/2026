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
  <details class="group/pl rounded border border-blue-200 bg-blue-50 px-3 py-2">
    <summary class="db-summary">
      <span class="db-arrow group-open/pl:rotate-90">▶</span>
      <span class="text-blue-600/70">playlist</span>
      <span class="text-black">{{ val(pl, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${pl._id}`"
        target="_blank"
        class="db-id-link"
        @click.stop
      > {{ pl._id }}</a>
    </summary>

    <dl class="db-props">
      <dt>valid_from</dt><dd>{{ val(pl, 'valid_from') ?? '—' }}</dd>
      <dt>valid_to</dt><dd>{{ val(pl, 'valid_to') ?? '—' }}</dd>
    </dl>

    <div class="db-children">
      <DashboardPlaylistMedia
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
