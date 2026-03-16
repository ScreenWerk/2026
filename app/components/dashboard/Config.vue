<script setup lang="ts">
import type { EntuEntity } from '~/types/entu'

const props = defineProps<{ cfg: EntuEntity }>()
const { db } = useDashboard()

const schedules = computed(() =>
  [...(db.value?.schedulesByConfig[props.cfg._id] ?? [])].sort(byName)
)
</script>

<template>
  <details class="db-card group/cfg border-amber-200 bg-amber-50">
    <summary class="db-summary">
      <span class="db-arrow group-open/cfg:rotate-90">▶</span>
      <span class="text-yellow-600/70">configuration</span>
      <span class="text-black">{{ val(cfg, 'name') }}</span>
      <DashboardIdLink :id="cfg._id" />
    </summary>

    <dl class="db-props">
      <dt>update_interval</dt><dd>{{ val(cfg, 'update_interval', 'number') ?? '—' }}</dd>
    </dl>

    <div class="db-children">
      <DashboardSchedule
        v-for="schedule in schedules"
        :key="schedule._id"
        :schedule="schedule"
      />
      <div
        v-if="!schedules.length"
        class="db-empty"
      >
        no schedules
      </div>
    </div>
  </details>
</template>
