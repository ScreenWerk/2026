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

.db-summary {
  @apply flex cursor-pointer select-none list-none items-start gap-2 rounded py-0.5 pr-2 [&::-webkit-details-marker]:hidden;
}

.db-arrow {
  @apply w-3 shrink-0 text-black/40 transition-transform;
}

.db-props {
  @apply grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 pb-1 pl-5 pt-0.5 text-black/60;
}

.db-children {
  @apply ml-5 mt-1 space-y-1;
}

.db-id-link {
  @apply ml-auto text-black/40 underline decoration-dotted hover:text-black/60;
}

.db-empty {
  @apply py-0.5 text-black/40;
}
</style>
