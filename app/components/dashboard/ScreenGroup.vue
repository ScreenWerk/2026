<script setup lang="ts">
import type { EntuEntity } from '~/types/entu'

const props = defineProps<{ sg: EntuEntity }>()
const { db } = useDashboard()
const route = useRoute()

const account = computed(() => route.params.account as string)

const screens = computed(() =>
  [...(db.value?.screensByGroup[props.sg._id] ?? [])].sort(byName)
)

const cfg = computed(() => {
  const ref = val(props.sg, 'configuration', 'reference') as string | null
  return ref ? db.value?.configById[ref] : undefined
})
</script>

<template>
  <details class="db-card group/sg border-r border-green-200 bg-green-50 pr-3">
    <summary class="db-summary py-1">
      <span class="db-arrow text-green-600/70 group-open/sg:rotate-90">›</span>
      <span class="text-green-600/70">screen_group</span>
      <span class="text-black">{{ val(sg, 'name') }}</span>
      <DashboardIdLink :id="sg._id" />
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
      <details class="db-card group/scr border-r border-sky-200 bg-sky-50">
        <summary class="db-summary">
          <span class="db-arrow text-sky-600/70 group-open/scr:rotate-90">›</span>
          <span class="text-sky-600/70">screens</span>
          <span class="text-black/40">({{ screens.length }})</span>
        </summary>
        <div class="mt-1 space-y-0.5">
          <div
            v-for="screen in screens"
            :key="screen._id"
            class="db-row pl-5"
          >
            <span class="text-sky-600/70">screen</span>
            <a
              :href="`/${account}/${screen._id}`"
              target="_blank"
              class="db-link"
            >{{ val(screen, 'name') }}</a>
            <DashboardIdLink :id="screen._id" />
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
