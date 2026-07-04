<script setup>
import { onMounted, ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import { useGithubStore } from '@/stores/github'

const githubStore = useGithubStore()

// Koordinat untuk kursor kustom
const mouseX = ref(-100)
const mouseY = ref(-100)
const dotX = ref(-100)
const dotY = ref(-100)
const isHovering = ref(false)

const handleMouseMove = (e) => {
  // Dot langsung mengikuti cursor
  dotX.value = e.clientX
  dotY.value = e.clientY
  
  // Follower (lingkaran luar) mengikuti dengan sedikit jeda (dihandle CSS transition)
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

// Deteksi apakah cursor mengarah ke elemen interaktif
const handleMouseOver = (e) => {
  const target = e.target
  if (
    target.tagName === 'A' || 
    target.tagName === 'BUTTON' || 
    target.closest('button') || 
    target.closest('a') ||
    target.classList.contains('interactive')
  ) {
    isHovering.value = true
  } else {
    isHovering.value = false
  }
}

onMounted(() => {
  // Ambil data github secara global saat aplikasi dimuat
  githubStore.fetchProfile()

  // Pasang event listener untuk custom cursor
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseover', handleMouseOver)
})

const dotStyle = computed(() => ({
  transform: `translate3d(${dotX.value}px, ${dotY.value}px, 0)`,
}))

const cursorStyle = computed(() => ({
  transform: `translate3d(${mouseX.value}px, ${mouseY.value}px, 0)`,
}))
</script>

<template>
  <div class="min-h-screen bg-[#0b0f19] text-[#e2e8f0] font-sans antialiased overflow-x-hidden select-none">
    <!-- Custom Mouse Cursor Followers (Hanya aktif di desktop) -->
    <div 
      class="custom-cursor-dot pointer-events-none fixed top-0 left-0 w-2 h-2 -mt-1 -ml-1 bg-cyan-400 rounded-full z-9999 mix-blend-difference transition-transform duration-75 ease-out hidden md:block"
      :style="dotStyle"
    ></div>
    <div 
      class="custom-cursor pointer-events-none fixed top-0 left-0 w-8 h-8 -mt-4 -ml-4 border border-cyan-400/50 rounded-full z-9999 mix-blend-difference transition-transform duration-300 ease-out hidden md:block"
      :class="{ 'scale-150 border-purple-400 bg-purple-400/10': isHovering }"
      :style="cursorStyle"
    ></div>

    <!-- Router View (Menampilkan EditorLayout atau TerminalView) -->
    <RouterView v-slot="{ Component }">
      <transition name="fade-workspace" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style>
/* CSS Global untuk transisi Workspace & Kursor */
.fade-workspace-enter-active,
.fade-workspace-leave-active {
  transition: all 0.3s ease;
}

.fade-workspace-enter-from {
  opacity: 0;
  transform: scale(0.98);
  filter: blur(4px);
}

.fade-workspace-leave-to {
  opacity: 0;
  transform: scale(1.02);
  filter: blur(4px);
}

/* Sembunyikan cursor bawaan di browser jika menginginkan kustom penuh */
@media (min-width: 768px) {
  html, body {
    cursor: none;
  }
  a, button, [role="button"] {
    cursor: none;
  }
}
</style>
