<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ schedule: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const layout = computed(() => {
  const ref = val(props.schedule, 'layout', 'reference') as string | null
  return ref ? db.value?.layoutById[ref] : undefined
})
</script>

<template>
  <details class="group/sch border border-purple-200 rounded bg-purple-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/sch:rotate-90">▶</span>
      <span class="text-purple-600/70">schedule</span>
      <span class="text-black">{{ val(schedule, 'crontab') }}</span>
      <a
        :href="`${entuAppBase}/${schedule._id}`"
        target="_blank"
        class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
        @click.stop
      > {{schedule._id }}</a>
    </summary>

    <div class="space-y-0.5 pl-5 pt-0.5 pb-1 text-black/60">
      <div>name: {{ val(schedule, 'name') ?? '—' }}</div>
      <div>ordinal: {{ val(schedule, 'ordinal', 'number') ?? '—' }}</div>
      <div>duration: {{ val(schedule, 'duration', 'number') != null ? `${val(schedule, 'duration', 'number')}min` : '—' }}</div>
      <div>cleanup: {{ val(schedule, 'cleanup', 'boolean') ? 'true' : 'false' }}</div>
      <div>valid_from: {{ val(schedule, 'valid_from') ?? '—' }}</div>
      <div>valid_to: {{ val(schedule, 'valid_to') ?? '—' }}</div>
    </div>

    <div class="ml-3 mt-1 space-y-1 pl-3">
      <DashboardLayout v-if="layout" :layout="layout" />
      <div v-else class="py-0.5 text-black/40">
        no layout linked
      </div>
    </div>
  </details>
</template>
