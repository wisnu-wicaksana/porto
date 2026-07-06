<script setup>
import { VIRTUAL_FILES } from '@/constants/files'

defineProps({
  activeFile: { type: Object, required: true },
  isMobileSidebarOpen: { type: Boolean, required: true }
})
const emit = defineEmits(['select-file', 'open-terminal'])
</script>

<template>
  <aside 
    class="w-60 bg-slate-950 border-r border-slate-800/80 flex flex-col select-none shrink-0 transition-transform duration-300 z-10
           absolute md:static top-0 bottom-0 left-0 h-full
           md:translate-x-0"
    :class="isMobileSidebarOpen ? 'translate-x-0 shadow-2xl shadow-cyan-950/40' : '-translate-x-full md:translate-x-0'"
  >
    <div class="p-3 border-b border-slate-800/40 flex items-center justify-between">
      <span class="text-xs font-bold tracking-wider text-slate-400 font-mono">EXPLORER: PORTO</span>
    </div>
    
    <!-- Tree View Root Folder -->
    <div class="flex-1 overflow-y-auto p-2 text-sm font-mono">
      <div class="flex items-center space-x-1.5 text-slate-300 py-1 px-2 font-bold">
        <span>wisnu-porto</span>
      </div>
      
      <!-- Virtual Files List -->
      <div class="pl-4 space-y-0.5">
        <button 
          v-for="file in VIRTUAL_FILES" 
          :key="file.name"
          @click="emit('select-file', file)"
          class="w-full flex items-center justify-between py-1 px-2.5 rounded text-left transition-all interactive
                 hover:bg-slate-800/40 hover:text-slate-200"
          :class="activeFile?.path === file.path ? 'bg-cyan-950/30 text-cyan-400 font-medium border-l border-cyan-400/50' : 'text-slate-400'"
        >
          <div class="flex items-center space-x-2">
            <span class="truncate">{{ file.name }}</span>
          </div>
          <span v-if="activeFile?.path === file.path" class="text-[9px] bg-cyan-950 text-cyan-400 px-1 rounded-sm border border-cyan-800/50">ACTIVE</span>
        </button>
      </div>
    </div>

    <!-- Shortcut ke Terminal di Sidebar -->
    <div class="p-3 border-t border-slate-800/40 bg-slate-900/50">
      <button 
        @click="emit('open-terminal')"
        class="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 hover:text-cyan-400 transition-all font-mono text-xs interactive shadow-sm"
      >
        <span class="font-bold">>_</span>
        <span>run_terminal.sh</span>
      </button>
    </div>
  </aside>
</template>
