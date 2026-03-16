<script setup lang="ts">
const account = ref('')
const screenId = ref('')
const router = useRouter()

useHead({ title: 'ScreenWerk' })

function open () {
  const acc = account.value.trim()
  const id = screenId.value.trim()

  if (!acc || !id) return

  router.push(`/${acc}/${id}`)
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
        v-model="account"
        type="text"
        placeholder="Account"
        class="w-72 rounded bg-white/10 px-4 py-2 font-mono text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-white/30 focus:ring-white/60"
        autocomplete="off"
        spellcheck="false"
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
        :disabled="!account.trim() || !screenId.trim()"
      >
        Open Player
      </button>
    </form>
  </div>
</template>
