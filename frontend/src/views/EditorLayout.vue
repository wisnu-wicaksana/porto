<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { VIRTUAL_FILES } from '@/constants/files'

// State untuk theme
const isLightMode = ref(document.documentElement.classList.contains('light'))

const toggleTheme = () => {
  isLightMode.value = !isLightMode.value
  if (isLightMode.value) {
    document.documentElement.classList.add('light')
  } else {
    document.documentElement.classList.remove('light')
  }
}

const route = useRoute()
const router = useRouter()

// State untuk Sidebar Mobile (laci menu)
const isMobileSidebarOpen = ref(false)

// State untuk daftar Tab yang sedang terbuka di editor
const openTabs = ref([
  VIRTUAL_FILES.readme,
  VIRTUAL_FILES.projects,
  VIRTUAL_FILES.skills,
  VIRTUAL_FILES.contact
])

// File yang saat ini aktif berdasarkan path rute aktif
const activeFile = computed(() => {
  const currentPath = route.path
  return Object.values(VIRTUAL_FILES).find(file => file.path === currentPath) || {}
})

// Fungsi untuk beralih file
const selectFile = (file) => {
  // Tambahkan ke openTabs jika belum ada
  if (!openTabs.value.find(t => t.path === file.path)) {
    openTabs.value.push(file)
  }
  router.push(file.path)
  isMobileSidebarOpen.value = false // Tutup sidebar di mobile setelah memilih
}

// Fungsi menutup tab
const closeTab = (file, event) => {
  event.stopPropagation()
  
  // Jika tab yang ditutup adalah tab aktif, pindahkan aktif ke tab lainnya
  if (activeFile.value.path === file.path) {
    const remainingTabs = openTabs.value.filter(t => t.path !== file.path)
    if (remainingTabs.length > 0) {
      router.push(remainingTabs[remainingTabs.length - 1].path)
    } else {
      router.push('/editor')
    }
  }
  
  openTabs.value = openTabs.value.filter(t => t.path !== file.path)
}

// Navigasi ke Terminal Mode
const openTerminal = () => {
  router.push('/terminal')
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col overflow-hidden bg-slate-950 text-slate-300 font-mono selection:bg-cyan-500/30">
    
    <!-- 1. TITLEBAR (Atas - Gaya MacOS Window) -->
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
          @click="isMobileSidebarOpen = !isMobileSidebarOpen"
          class="md:hidden p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all interactive"
          aria-label="Toggle File Explorer"
        >
          <span class="text-xs font-mono font-bold">{{ isMobileSidebarOpen ? 'CLOSE' : 'FILES' }}</span>
        </button>
      </div>
      
      <!-- Judul Dokumen/File Aktif (Tengah) -->
      <div class="text-xs text-slate-400 font-mono flex items-center space-x-2 bg-slate-900/50 px-4 md:px-6 py-1 rounded-md border border-slate-800/80 max-w-[60%] md:max-w-md truncate mx-auto">
        <span class="text-cyan-400 hidden sm:inline">⚡</span>
        <span class="truncate">porto - {{ activeFile.name || 'Idle' }} <span class="hidden sm:inline">- Visual Studio Code</span></span>
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

    <!-- CONTAINER UTAMA (Sidebar + Editor Panel) -->
    <div class="flex-1 flex overflow-hidden relative">

      <!-- 2. ACTIVITY BAR (Sisi Kiri Desktop - Navigasi Vertikal) -->
      <nav class="hidden md:flex flex-col w-12 bg-slate-950 border-r border-slate-800/60 justify-between items-center py-4 select-none shrink-0">
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
            @click="selectFile(file)"
            class="text-slate-500 hover:text-slate-300 transition-all text-lg interactive"
            :class="{ '!text-cyan-400': activeFile.path === file.path }"
            :title="file.name"
          >
            <span class="text-[10px] font-bold tracking-wider uppercase">{{ file.name.substring(0,2) }}</span>
          </button>
        </div>
        
        <!-- Grup Ikon Bawah (Ke Terminal) -->
        <div class="flex flex-col items-center">
          <button 
            @click="openTerminal"
            class="p-2 rounded text-slate-500 hover:text-green-400 transition-all text-xl interactive hover:scale-110"
            title="Buka Terminal CLI"
          >
            <span class="text-xs font-bold tracking-widest">CLI</span>
          </button>
        </div>
      </nav>

      <!-- 3. SIDEBAR FILE EXPLORER (Desktop & Mobile Overlay Drawer) -->
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
              @click="selectFile(file)"
              class="w-full flex items-center justify-between py-1 px-2.5 rounded text-left transition-all interactive
                     hover:bg-slate-800/40 hover:text-slate-200"
              :class="activeFile.path === file.path ? 'bg-cyan-950/30 text-cyan-400 font-medium border-l border-cyan-400/50' : 'text-slate-400'"
            >
              <div class="flex items-center space-x-2">
                <span class="truncate">{{ file.name }}</span>
              </div>
              <span v-if="activeFile.path === file.path" class="text-[9px] bg-cyan-950 text-cyan-400 px-1 rounded-sm border border-cyan-800/50">ACTIVE</span>
            </button>
          </div>
        </div>

        <!-- Shortcut ke Terminal di Sidebar -->
        <div class="p-3 border-t border-slate-800/40 bg-slate-950/20">
          <button 
            @click="openTerminal"
            class="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded bg-green-950/40 hover:bg-green-900/40 text-green-400 border border-green-800/40 hover:border-green-600/50 transition-all font-mono text-xs interactive"
          >
            <span class="font-bold">>_</span>
            <span>run_terminal.sh</span>
          </button>
        </div>
      </aside>

      <!-- Overlay penutup sidebar mobile jika diklik luar -->
      <div 
        v-if="isMobileSidebarOpen"
        @click="isMobileSidebarOpen = false"
        class="fixed inset-0 bg-black/60 z-5 md:hidden"
      ></div>

      <!-- 4. EDITOR PANEL (Tengah - Menampilkan Tab & Content) -->
      <main class="flex-1 flex flex-col overflow-hidden bg-slate-900">
        <!-- TABS BAR (Tab File Terbuka di Atas) -->
        <div class="h-9 bg-slate-950 border-b border-slate-800/80 flex items-center overflow-x-auto scrollbar-none select-none shrink-0">
          <div class="flex items-center h-full">
            <button 
              v-for="tab in openTabs"
              :key="tab.path"
              @click="selectFile(tab)"
              class="h-full flex items-center space-x-2 px-4 border-r border-slate-800/60 text-xs font-mono transition-all interactive
                     hover:bg-slate-900"
              :class="activeFile.path === tab.path ? 'bg-slate-900 text-cyan-400 border-t-2 border-t-cyan-400 font-medium' : 'text-slate-500 bg-slate-950/40'"
            >
              <span>{{ tab.name }}</span>
              <!-- Tombol Tutup Tab -->
              <span 
                @click="closeTab(tab, $event)"
                class="hover:bg-slate-800 hover:text-red-400 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] transition-all"
              >✕</span>
            </button>
          </div>
        </div>

        <!-- AREA UTAMA RENDERING VIEW -->
        <div class="flex-1 overflow-y-auto relative p-0 md:p-6 bg-slate-900">
          <div class="max-w-4xl mx-auto min-h-full md:rounded-lg border-b md:border border-slate-800/50 bg-slate-900 p-4 md:p-6 pb-6">
            <!-- Router View dengan Transisi Mulus -->
            <RouterView v-slot="{ Component }">
              <transition name="fade-editor" mode="out-in">
                <component :is="Component" />
              </transition>
            </RouterView>
          </div>
        </div>
      </main>
    </div>

    <!-- 5. STATUS BAR (Bawah) -->
    <footer class="hidden md:flex h-6 bg-slate-950 border-t border-slate-800/80 justify-between items-center px-3 text-[11px] font-mono text-slate-500 shrink-0 select-none z-20">
      <div class="flex items-center space-x-4">
        <!-- Git Branch -->
        <span class="flex items-center space-x-1 text-cyan-500">
          <span class="font-bold ml-1">main*</span>
        </span>
        <!-- GitHub API Status Indicator -->
        <span class="flex items-center space-x-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>GitHub GraphQL Sync</span>
        </span>
      </div>
      
      <div class="flex items-center space-x-4">
        <span>Ln 1, Col 1</span>
        <span>Spaces: 2</span>
        <span class="hidden sm:inline">UTF-8</span>
        <span class="text-purple-400 font-bold hidden sm:inline">Vercel Serverless v20</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* CSS khusus untuk transisi tab editor */
.fade-editor-enter-active,
.fade-editor-leave-active {
  transition: all 0.15s ease-out;
}

.fade-editor-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-editor-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Sembunyikan scrollbar bawaan */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
