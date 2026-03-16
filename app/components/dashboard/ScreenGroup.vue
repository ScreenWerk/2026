<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ sg: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const screens = computed(() =>
  [...(db.value?.screensByGroup[props.sg._id] ?? [])].sort(byName),
)

const cfg = computed(() => {
  const ref = val(props.sg, 'configuration', 'reference') as string | null
  return ref ? db.value?.configById[ref] : undefined
})
</script>

<template>
  <details class="group/sg border border-green-200 rounded bg-green-50 px-3 py-2">
    <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-1 [&::-webkit-details-marker]:hidden">
      <span class="w-3 shrink-0 text-black/40 transition-transform group-open/sg:rotate-90">▶</span>
      <span class="text-green-600/70">screen_group</span>
      <span class="text-black">{{ val(sg, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${sg._id}`"
        target="_blank"
        class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
        @click.stop
      > {{sg._id }}</a>
    </summary>

    <div class="space-y-0.5 pl-5 pt-0.5 pb-1 text-black/60">
      <div>published: {{ val(sg, 'published', 'datetime') ? String(val(sg, 'published', 'datetime')).slice(0, 16).replace('T', ' ') : '—' }}</div>
    </div>

    <div class="ml-3 mt-1 space-y-1 pl-3">
      <!-- Screens -->
      <details class="group/scr border-y border-l border-sky-200 rounded-l bg-sky-50 px-3 py-2">
        <summary class="flex cursor-pointer select-none list-none items-center gap-2 rounded pr-2 py-0.5 [&::-webkit-details-marker]:hidden">
          <span class="w-3 shrink-0 text-black/40 transition-transform group-open/scr:rotate-90">▶</span>
          <span class="text-sky-600/70">screens</span>
          <span class="text-black/40">({{ screens.length }})</span>
        </summary>
        <div class="ml-3 mt-1 space-y-0.5 pl-3">
          <div
            v-for="screen in screens"
            :key="screen._id"
            class="flex items-center gap-2 rounded pr-2 py-0.5"
          >
            <span class="text-sky-600/70">screen</span>
            <span class="text-black">{{ val(screen, 'name') }}</span>
            <a
              :href="`${entuAppBase}/${screen._id}`"
              target="_blank"
              class="ml-auto text-black/40 underline decoration-dotted hover:text-black/60"
              @click.stop
            > {{screen._id }}</a>
          </div>
          <div v-if="!screens.length" class="py-0.5 text-black/40">
            no screens
          </div>
        </div>
      </details>

      <!-- Configuration -->
      <DashboardConfig v-if="cfg" :cfg="cfg" />
      <div v-else class="py-0.5 text-black/40">
        no configuration linked
      </div>
    </div>
  </details>
</template>
