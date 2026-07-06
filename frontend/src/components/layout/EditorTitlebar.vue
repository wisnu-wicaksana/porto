<script setup>
import { ref } from 'vue'

defineProps({
  activeFile: { type: Object, required: true },
  isMobileSidebarOpen: { type: Boolean, required: true }
})
const emit = defineEmits(['toggle-sidebar'])

const isLightMode = ref(document.documentElement.classList.contains('light'))
const toggleTheme = () => {
  isLightMode.value = !isLightMode.value
  if (isLightMode.value) {
    document.documentElement.classList.add('light')
  } else {
    document.documentElement.classList.remove('light')
  }
}
</script>

<template>
  <header class="h-10 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 select-none shrink-0 z-20">
    <!-- Tombol Window & Toggle Files (Kiri) -->
    <div class="flex items-center w-1/4">
      <!-- Tombol Window (Hanya Desktop) -->
      <div class="hidden md:flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm"></span>
        <span class="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm"></span>
        <span class="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm"></span>
      </div>
      <!-- Button Toggle Sidebar (Hanya Mobile) -->
      <button 
        @click="emit('toggle-sidebar')"
        class="md:hidden p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all interactive"
        aria-label="Navigasi File"
      >
        <span class="text-xs font-mono font-bold">{{ isMobileSidebarOpen ? 'CLOSE' : 'FILES' }}</span>
      </button>
    </div>
    
    <!-- Judul Dokumen/File Aktif (Tengah) -->
    <div class="text-xs text-slate-400 font-mono flex items-center space-x-2 bg-slate-900/50 px-4 md:px-6 py-1 rounded-md border border-slate-800/80 max-w-[60%] md:max-w-md truncate mx-auto">
      <span class="text-cyan-400 hidden sm:inline">⚡</span>
      <span class="truncate">porto - {{ activeFile?.name || 'Idle' }} <span class="hidden sm:inline">- Visual Studio Code</span></span>
    </div>
    
    <!-- Tema & Versi (Kanan) -->
    <div class="flex justify-end items-center space-x-3 w-1/4">
      <!-- Theme Toggle Button -->
      <button 
        @click="toggleTheme"
        class="p-1.5 rounded bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800/80 transition-all flex items-center justify-center interactive"
        :title="isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
      >
        <span v-if="isLightMode" class="text-xs">🌙</span>
        <span v-else class="text-xs">☀️</span>
      </button>
      <span class="hidden md:inline-block text-[11px] text-slate-500 font-mono">v1.0.0</span>
    </div>
  </header>
</template>
