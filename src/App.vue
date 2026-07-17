<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useGithubStore } from '@/stores/github'

const githubStore = useGithubStore()

onMounted(() => {
  // Ambil data github secara global saat aplikasi dimuat
  githubStore.fetchProfile()
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-200 font-mono antialiased overflow-x-hidden select-none">
    <!-- Router View (Menampilkan EditorLayout atau TerminalView) -->
    <RouterView v-slot="{ Component }">
      <transition name="fade-workspace" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style>
/* CSS Global untuk transisi Workspace */
.fade-workspace-enter-active,
.fade-workspace-leave-active {
  transition: all 0.3s ease;
}

.fade-workspace-enter-from,
.fade-workspace-leave-to {
  opacity: 0;
}
</style>
