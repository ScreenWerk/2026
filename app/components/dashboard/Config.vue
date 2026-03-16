<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ cfg: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const schedules = computed(() =>
  [...(db.value?.schedulesByConfig[props.cfg._id] ?? [])].sort(byName)
)
</script>

<template>
  <details class="group/cfg rounded border border-amber-200 bg-amber-50 px-3 py-2">
    <summary class="db-summary">
      <span class="db-arrow group-open/cfg:rotate-90">▶</span>
      <span class="text-yellow-600/70">configuration</span>
      <span class="text-black">{{ val(cfg, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${cfg._id}`"
        target="_blank"
        class="db-id-link"
        @click.stop
      > {{ cfg._id }}</a>
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
