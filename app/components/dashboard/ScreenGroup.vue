<script setup lang="ts">
import type { Ref } from 'vue'
import type { EntuEntity } from '~/types/entu'
import type { DashboardData } from '~/types/dashboard'

const props = defineProps<{ sg: EntuEntity }>()
const db = inject('db') as Ref<DashboardData | null | undefined>
const entuAppBase = inject<string>('dbBase', '')

const screens = computed(() =>
  [...(db.value?.screensByGroup[props.sg._id] ?? [])].sort(byName)
)

const cfg = computed(() => {
  const ref = val(props.sg, 'configuration', 'reference') as string | null
  return ref ? db.value?.configById[ref] : undefined
})
</script>

<template>
  <details class="group/sg rounded border border-green-200 bg-green-50 px-3 py-2">
    <summary class="db-summary py-1">
      <span class="db-arrow group-open/sg:rotate-90">▶</span>
      <span class="text-green-600/70">screen_group</span>
      <span class="text-black">{{ val(sg, 'name') }}</span>
      <a
        :href="`${entuAppBase}/${sg._id}`"
        target="_blank"
        class="db-id-link"
        @click.stop
      > {{ sg._id }}</a>
    </summary>

    <dl class="db-props">
      <dt>published</dt><dd>{{ val(sg, 'published', 'datetime') ? String(val(sg, 'published', 'datetime')).slice(0, 19).replace('T', ' ') : '—' }}</dd>
    </dl>

    <div class="db-children">
      <!-- Configuration -->
      <DashboardConfig
        v-if="cfg"
        :cfg="cfg"
      />
      <div
        v-else
        class="py-0.5 text-black/40"
      >
        no configuration linked
      </div>

      <!-- Screens -->
      <details class="group/scr rounded border border-sky-200 bg-sky-50 px-3 py-2">
        <summary class="db-summary">
          <span class="db-arrow group-open/scr:rotate-90">▶</span>
          <span class="text-sky-600/70">screens</span>
          <span class="text-black/40">({{ screens.length }})</span>
        </summary>
        <div class="mt-1 space-y-0.5">
          <div
            v-for="screen in screens"
            :key="screen._id"
            class="flex items-start gap-2 rounded py-0.5 pr-2"
          >
            <span class="text-sky-600/70">screen</span>
            <a
              :href="`/${screen._id}`"
              target="_blank"
              class="text-black underline decoration-dotted hover:text-black/60"
            >{{ val(screen, 'name') }}</a>
            <a
              :href="`${entuAppBase}/${screen._id}`"
              target="_blank"
              class="db-id-link"
              @click.stop
            > {{ screen._id }}</a>
          </div>
          <div
            v-if="!screens.length"
            class="db-empty"
          >
            no screens
          </div>
        </div>
      </details>
    </div>
  </details>
</template>
