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
  @apply flex flex-wrap cursor-pointer select-none list-none items-center gap-x-2 overflow-hidden rounded py-0.5 pr-2 [&::-webkit-details-marker]:hidden sm:flex-nowrap;
}

.db-name {
  @apply min-w-0 truncate order-last basis-full pl-5 sm:order-none sm:flex-1 sm:basis-auto sm:pl-0;
}

.db-header {
  @apply flex flex-1 items-center gap-x-2 sm:contents;
}

.db-arrow {
  @apply w-3 shrink-0 text-lg leading-none transition-transform;
}

.db-props {
  @apply grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 pb-1 pl-5 pt-0.5 text-black/60;
}

.db-props > dd {
  @apply min-w-0 truncate;
}

.db-children {
  @apply ml-5 mt-1 space-y-1;
}

.db-id-link {
  @apply ml-auto shrink-0 text-black/40 underline decoration-dotted hover:text-black/60 sm:ml-0 sm:order-last;
}

.db-card {
  @apply border-y border-l pl-3 py-2;
}

.db-row {
  @apply flex flex-wrap items-center gap-x-2 rounded py-0.5 pr-2;
}

.db-link {
  @apply text-black underline decoration-dotted hover:text-black/60;
}

.db-empty {
  @apply py-0.5 text-black/40;
}
</style>
