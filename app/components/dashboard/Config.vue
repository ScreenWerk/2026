<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ cfg: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const schedules = computed(() =>
  [...(db.value?.schedulesByConfig[props.cfg._id] ?? [])].sort(byName),
)
</script>

<template>
  <details class="group/cfg border border-amber-200 rounded bg-amber-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/cfg:rotate-90">▶</span>
      <span class="text-yellow-600/70">configuration</span>
      <span class="text-black">{{ val(cfg, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${cfg._id}`"
        target="_blank"
        class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
        @click.stop
      > {{cfg._id }}</a>
    </summary>

    <div class="space-y-0.5 pl-5 pt-0.5 pb-1 text-black/60">
      <div>update_interval: {{ val(cfg, 'update_interval', 'number') ?? '—' }}</div>
    </div>

    <div class="ml-3 mt-1 space-y-1 pl-3">
      <details class="group/schl border border-purple-200 rounded bg-purple-50 px-3 py-2">
        <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
          <span class="w-3 shrink-0 text-black/40 transition-transform group-open/schl:rotate-90">▶</span>
          <span class="text-purple-600/70">schedules</span>
          <span class="text-black/40">({{ schedules.length }})</span>
        </summary>
        <div class="ml-3 mt-1 space-y-1 pl-3">
          <DashboardSchedule v-for="schedule in schedules" :key="schedule._id" :schedule="schedule" />
          <div v-if="!schedules.length" class="py-0.5 text-black/40">
            no schedules
          </div>
        </div>
      </details>
    </div>
  </details>
</template>
