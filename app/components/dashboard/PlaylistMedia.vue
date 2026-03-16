<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ pm: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const media = computed(() => {
  const ref = val(props.pm, 'media', 'reference') as string | null
  return ref ? db.value?.mediaById[ref] : undefined
})
</script>

<template>
  <details class="group/pmi border border-indigo-200 rounded bg-indigo-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/pmi:rotate-90">▶</span>
      <span class="w-5 shrink-0 text-right text-black/40">{{ val(pm, 'ordinal', 'number') }}</span>
      <template v-if="media">
        <span class="text-indigo-700/70">{{ val(media, 'type') }}</span>
        <span class="text-black">{{ val(media, 'name') }}</span>
      </template>
      <template v-else>
        <span class="text-black/40">{{ val(pm, 'media', 'reference') }}</span>
      </template>
      <a
        :href="`${entuAppBase}/${pm._id}`"
        target="_blank"
        class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
        @click.stop
      > {{pm._id }}</a>
    </summary>

    <dl class="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 pl-5 pt-0.5 pb-1 text-black/60">
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
