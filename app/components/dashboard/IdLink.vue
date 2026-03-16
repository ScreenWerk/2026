<script setup lang="ts">
const { entuAppBase } = useDashboard()
defineProps<{ id: string }>()
</script>

<template>
  <a
    :href="`${entuAppBase}/${id}`"
    target="_blank"
    class="db-id-link"
    @click.stop
  > {{ id }}</a>
</template>
