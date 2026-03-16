<script setup lang="ts">
import type { EntuEntity } from '~/types/entu'

const props = defineProps<{ pm: EntuEntity }>()
const { db } = useDashboard()

const media = computed(() => {
  const ref = val(props.pm, 'media', 'reference') as string | null
  return ref ? db.value?.mediaById[ref] : undefined
})
</script>

<template>
  <details class="db-card group/pmi border-indigo-200 bg-indigo-50">
    <summary class="db-summary">
      <span class="db-arrow text-fuchsia-600/70 group-open/pmi:rotate-90">›</span>
      <span class="w-5 shrink-0 text-right text-black/40">{{ val(pm, 'ordinal', 'number') }}</span>
      <template v-if="media">
        <span class="text-fuchsia-600/70">{{ val(media, 'type') }}</span>
        <span class="text-black">{{ val(media, 'name') }}</span>
      </template>
      <template v-else>
        <span class="text-black/40">{{ val(pm, 'media', 'reference') }}</span>
      </template>
      <dashboard-id-link :id="pm._id" />
    </summary>

    <dl class="db-props">
      <template v-if="media">
        <dt>file</dt><dd>{{ val(media, 'file', 'filename') ?? '—' }}</dd>
        <dt>url</dt><dd>{{ val(media, 'url') ?? '—' }}</dd>
        <dt>valid_from</dt><dd>{{ val(media, 'valid_from') ?? '—' }}</dd>
        <dt>valid_to</dt><dd>{{ val(media, 'valid_to') ?? '—' }}</dd>
      </template>
      <dt>duration</dt><dd>{{ val(pm, 'duration', 'number') != null ? `${val(pm, 'duration', 'number')}s` : '—' }}</dd>
      <dt>delay</dt><dd>{{ val(pm, 'delay', 'number') != null ? `${val(pm, 'delay', 'number')}s` : '—' }}</dd>
      <dt>valid_from</dt><dd>{{ val(pm, 'valid_from') ?? '—' }}</dd>
      <dt>valid_to</dt><dd>{{ val(pm, 'valid_to') ?? '—' }}</dd>
      <dt>mute</dt><dd>{{ val(pm, 'mute', 'boolean') ? 'true' : 'false' }}</dd>
      <dt>stretch</dt><dd>{{ val(pm, 'stretch', 'boolean') ? 'true' : 'false' }}</dd>
    </dl>
  </details>
</template>
