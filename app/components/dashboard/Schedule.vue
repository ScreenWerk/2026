<script setup lang="ts">
import type { EntuEntity } from '~/types/entu'

const props = defineProps<{ schedule: EntuEntity }>()
const { db } = useDashboard()

const layout = computed(() => {
  const ref = val(props.schedule, 'layout', 'reference') as string | null
  return ref ? db.value?.layoutById[ref] : undefined
})
</script>

<template>
  <details class="db-card group/sch border-red-200 bg-red-50">
    <summary class="db-summary">
      <span class="db-arrow text-red-600/70 group-open/sch:rotate-90">›</span>
      <span class="text-red-600/70">schedule</span>
      <span class="text-black">{{ val(schedule, 'crontab') }}</span>
      <DashboardIdLink :id="schedule._id" />
    </summary>

    <dl class="db-props">
      <dt>name</dt><dd>{{ val(schedule, 'name') ?? '—' }}</dd>
      <dt>ordinal</dt><dd>{{ val(schedule, 'ordinal', 'number') ?? '—' }}</dd>
      <dt>duration</dt><dd>{{ val(schedule, 'duration', 'number') != null ? `${val(schedule, 'duration', 'number')}min` : '—' }}</dd>
      <dt>cleanup</dt><dd>{{ val(schedule, 'cleanup', 'boolean') ? 'true' : 'false' }}</dd>
      <dt>valid_from</dt><dd>{{ val(schedule, 'valid_from') ?? '—' }}</dd>
      <dt>valid_to</dt><dd>{{ val(schedule, 'valid_to') ?? '—' }}</dd>
    </dl>

    <div class="db-children">
      <DashboardLayout
        v-if="layout"
        :layout="layout"
      />
      <div
        v-else
        class="db-empty"
      >
        no layout linked
      </div>
    </div>
  </details>
</template>
