<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { VIRTUAL_FILES } from '@/constants/files'

// Import Layout Components
import EditorTitlebar from '@/components/layout/EditorTitlebar.vue'
import ActivityBar from '@/components/layout/ActivityBar.vue'
import EditorSidebar from '@/components/layout/EditorSidebar.vue'
import TabsBar from '@/components/layout/TabsBar.vue'
import StatusBar from '@/components/layout/StatusBar.vue'

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
  if (!openTabs.value.find(t => t.path === file.path)) {
    openTabs.value.push(file)
  }
  router.push(file.path)
  isMobileSidebarOpen.value = false // Tutup sidebar di mobile setelah memilih
}

// Fungsi menutup tab
const closeTab = (file, event) => {
  event?.stopPropagation?.()
  
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
    
    <!-- 1. TITLEBAR -->
    <EditorTitlebar 
      :activeFile="activeFile" 
      :isMobileSidebarOpen="isMobileSidebarOpen"
      @toggle-sidebar="isMobileSidebarOpen = !isMobileSidebarOpen"
    />

    <!-- CONTAINER UTAMA (Sidebar + Editor Panel) -->
    <div class="flex-1 flex overflow-hidden relative">

      <!-- 2. ACTIVITY BAR (Desktop) -->
      <ActivityBar 
        :activeFile="activeFile"
        @select-file="selectFile"
        @open-terminal="openTerminal"
      />

      <!-- 3. SIDEBAR FILE EXPLORER -->
      <EditorSidebar 
        :activeFile="activeFile"
        :isMobileSidebarOpen="isMobileSidebarOpen"
        @select-file="selectFile"
        @open-terminal="openTerminal"
      />

      <!-- Overlay penutup sidebar mobile jika diklik luar -->
      <div 
        v-if="isMobileSidebarOpen"
        @click="isMobileSidebarOpen = false"
        class="fixed inset-0 bg-black/60 z-5 md:hidden"
      ></div>

      <!-- 4. EDITOR PANEL -->
      <main class="flex-1 flex flex-col overflow-hidden bg-slate-900">
        
        <!-- TABS BAR -->
        <TabsBar 
          :openTabs="openTabs"
          :activeFile="activeFile"
          @select-file="selectFile"
          @close-tab="closeTab"
        />

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

    <!-- 5. STATUS BAR -->
    <StatusBar />
    
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
</style>
