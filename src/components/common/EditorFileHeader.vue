<script setup>
defineProps({
  path: { type: String, required: true }
})
</script>

<template>
  <div class="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4 select-none shrink-0">
    <div class="flex items-center space-x-2 text-slate-400">
      <span class="text-xs"> src / views / editor / {{ path }}</span>
    </div>
  </div>
</template>
