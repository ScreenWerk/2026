<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ pm: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')
</script>

<template>
  <details class="group/pmi border border-cyan-200 rounded bg-cyan-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/pmi:rotate-90">▶</span>
      <span class="w-5 shrink-0 text-right text-black/40">{{ val(pm, 'ordinal', 'number') }}</span>
      <template v-if="val(pm, 'media', 'reference') && db?.value?.mediaById[val(pm, 'media', 'reference') as string]">
        <span class="text-cyan-700/70">{{ val(db?.value?.mediaById[val(pm, 'media', 'reference') as string], 'type') }}</span>
        <span class="text-black">{{ val(db?.value?.mediaById[val(pm, 'media', 'reference') as string], 'name') }}</span>
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

    <div class="space-y-0.5 pl-5 pt-0.5 pb-1 text-black/60">
      <div>name: {{ val(pm, 'name') ?? '—' }}</div>
      <template v-if="val(pm, 'media', 'reference') && db?.value?.mediaById[val(pm, 'media', 'reference') as string]">
        <div>file: {{ val(db?.value?.mediaById[val(pm, 'media', 'reference') as string], 'file', 'filename') ?? '—' }}</div>
        <div>url: {{ val(db?.value?.mediaById[val(pm, 'media', 'reference') as string], 'url') ?? '—' }}</div>
        <div>valid_from: {{ val(db?.value?.mediaById[val(pm, 'media', 'reference') as string], 'valid_from') ?? '—' }}</div>
        <div>valid_to: {{ val(db?.value?.mediaById[val(pm, 'media', 'reference') as string], 'valid_to') ?? '—' }}</div>
      </template>
      <div>duration: {{ val(pm, 'duration', 'number') != null ? `${val(pm, 'duration', 'number')}s` : '—' }}</div>
      <div>delay: {{ val(pm, 'delay', 'number') != null ? `${val(pm, 'delay', 'number')}s` : '—' }}</div>
      <div>valid_from: {{ val(pm, 'valid_from') ?? '—' }}</div>
      <div>valid_to: {{ val(pm, 'valid_to') ?? '—' }}</div>
      <div>mute: {{ val(pm, 'mute', 'boolean') ? 'true' : 'false' }}</div>
      <div>stretch: {{ val(pm, 'stretch', 'boolean') ? 'true' : 'false' }}</div>
    </div>
  </details>
</template>
