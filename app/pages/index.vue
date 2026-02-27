<script setup lang="ts">
const screenId = ref('')
const router = useRouter()

function open () {
  const id = screenId.value.trim()

  if (!id) return

  router.push(`/${id}`)
}
</script>

<template>
  <div class="flex h-screen w-screen flex-col items-center justify-center gap-20 bg-black text-white">
    <div class="text-5xl font-extralight tracking-widest text-white/50">
      SCREENWERK
    </div>

    <form
      class="flex flex-col gap-2"
      @submit.prevent="open"
    >
      <input
        v-model="screenId"
        type="text"
        placeholder="Screen ID"
        class="w-72 rounded bg-white/10 px-4 py-2 font-mono text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-white/30 focus:ring-white/60"
        autocomplete="off"
        spellcheck="false"
      >
      <button
        type="submit"
        class="rounded bg-white/10 px-4 py-2 font-mono text-sm text-white/70 ring-1 ring-white/20 hover:bg-white/20 hover:text-white disabled:opacity-30"
        :disabled="!screenId.trim()"
      >
        Open
      </button>
    </form>
  </div>
</template>
