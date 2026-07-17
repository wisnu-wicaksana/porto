<script setup>
defineProps({
  openTabs: { type: Array, required: true },
  activeFile: { type: Object, required: true }
})
const emit = defineEmits(['select-file', 'close-tab'])
</script>

<template>
  <div class="h-9 bg-slate-950 border-b border-slate-800/80 flex items-center overflow-x-auto scrollbar-none select-none shrink-0">
    <div class="flex items-center h-full">
      <button 
        v-for="tab in openTabs"
        :key="tab.path"
        @click="emit('select-file', tab)"
        class="h-full flex items-center space-x-2 px-4 border-r border-slate-800/60 text-xs font-mono transition-all interactive hover:bg-slate-900"
        :class="activeFile?.path === tab.path ? 'bg-slate-900 text-cyan-400 border-t-2 border-t-cyan-400 font-medium' : 'text-slate-500 bg-slate-950/40'"
      >
        <span>{{ tab.name }}</span>
        <!-- Tombol Tutup Tab -->
        <span 
          @click="emit('close-tab', tab, $event)"
          class="hover:bg-slate-800 hover:text-red-400 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] transition-all"
          aria-label="Tutup Tab"
        >✕</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Sembunyikan scrollbar bawaan */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
