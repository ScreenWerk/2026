<template>
  <div class="h-screen w-screen overflow-hidden bg-black">
    <NuxtPage />
  </div>
</template>

<style>
@reference "tailwindcss";
dl > dt:hover,
dl > dt:hover + dd,
dl > dt:has(+ dd:hover),
dl > dd:hover {
  @apply text-black;
}
</style>
