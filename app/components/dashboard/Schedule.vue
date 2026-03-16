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
  <details class="group/sch rounded border border-purple-200 bg-purple-50 px-3 py-2">
    <summary class="db-summary">
      <span class="db-arrow group-open/sch:rotate-90">▶</span>
      <span class="text-purple-600/70">schedule</span>
      <span class="text-black">{{ val(schedule, 'crontab') }}</span>
      <a
        :href="`${entuAppBase}/${schedule._id}`"
        target="_blank"
        class="db-id-link"
        @click.stop
      > {{ schedule._id }}</a>
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
