<script setup>
import { VIRTUAL_FILES } from '@/constants/files'

defineProps({
  activeFile: { type: Object, required: true }
})
const emit = defineEmits(['select-file', 'open-terminal'])
</script>

<template>
  <nav class="hidden lg:flex flex-col w-12 bg-slate-950 border-r border-slate-800/60 justify-between items-center py-4 select-none shrink-0">
    <!-- Grup Ikon Atas -->
    <div class="flex flex-col space-y-6 w-full items-center">
      <!-- File Explorer Icon (Active) -->
      <button class="w-full text-cyan-400 border-l-2 border-cyan-400 py-1.5 flex justify-center hover:text-white transition-all interactive" title="Explorer">
        <span class="text-xs font-bold tracking-widest">EX</span>
      </button>
      
      <!-- Direct Link ke Rute-Rute File -->
      <button 
        v-for="file in VIRTUAL_FILES" 
        :key="file.name"
        @click="emit('select-file', file)"
        class="text-slate-500 hover:text-slate-300 transition-all text-lg interactive"
        :class="{ '!text-cyan-400': activeFile?.path === file.path }"
        :title="file.name"
      >
        <span class="text-[10px] font-bold tracking-wider uppercase">{{ file.name.substring(0,2) }}</span>
      </button>
    </div>
    
    <!-- Grup Ikon Bawah (Ke Terminal) -->
    <div class="flex flex-col items-center">
      <button 
        @click="emit('open-terminal')"
        class="p-2 rounded text-slate-500 hover:text-green-400 transition-all text-xl interactive hover:scale-110"
        title="Open Terminal CLI"
      >
        <span class="text-xs font-bold tracking-widest">CLI</span>
      </button>
    </div>
  </nav>
</template>
