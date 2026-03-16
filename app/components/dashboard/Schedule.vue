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

    <dl class="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 pl-5 pt-0.5 pb-1 text-black/60">
      <dt>name</dt><dd>{{ val(schedule, 'name') ?? '—' }}</dd>
      <dt>ordinal</dt><dd>{{ val(schedule, 'ordinal', 'number') ?? '—' }}</dd>
      <dt>duration</dt><dd>{{ val(schedule, 'duration', 'number') != null ? `${val(schedule, 'duration', 'number')}min` : '—' }}</dd>
      <dt>cleanup</dt><dd>{{ val(schedule, 'cleanup', 'boolean') ? 'true' : 'false' }}</dd>
      <dt>valid_from</dt><dd>{{ val(schedule, 'valid_from') ?? '—' }}</dd>
      <dt>valid_to</dt><dd>{{ val(schedule, 'valid_to') ?? '—' }}</dd>
    </dl>

    <div class="ml-3 mt-1 space-y-1 pl-3">
      <DashboardLayout v-if="layout" :layout="layout" />
      <div v-else class="py-0.5 text-black/40">
        no layout linked
      </div>
    </div>
  </details>
</template>
