<script setup>
import { ref, onMounted } from 'vue'
import { PROFILE } from '@/constants/profile'
import { VIRTUAL_FILES } from '@/constants/files'
import { useGithubStore } from '@/stores/github'

const githubStore = useGithubStore()
const isPreviewMode = ref(true)
const isZoomed = ref(false)

onMounted(() => {
  githubStore.fetchProfile()
})

// Isi Markdown mentah untuk tampilan Raw Code
const rawMarkdownLines = VIRTUAL_FILES.readme.raw.split('\n')

// Fungsi helper mewarnai baris markdown (sederhana syntax highlighting)
const highlightMarkdownLine = (line) => {
  if (line.startsWith('# ')) {
    return `<span class="text-cyan-400 font-bold">${line}</span>`
  }
  if (line.startsWith('## ')) {
    return `<span class="text-purple-400 font-bold">${line}</span>`
  }
  if (line.startsWith('> ')) {
    return `<span class="text-slate-500 italic">${line}</span>`
  }
  if (line.startsWith('- **')) {
    const parts = line.split(':')
    if (parts.length > 1) {
      return `<span class="text-slate-400">- <span class="text-yellow-400 font-bold">${parts[0].replace('- ', '')}</span>:${parts[1]}</span>`
    }
  }
  return `<span class="text-slate-300">${line}</span>`
}

// Efek mesin ketik (Typewriter) sederhana
const typedSubtitle = ref('')
const subtitleFull = PROFILE.role
let charIndex = 0

const typeWriter = () => {
  if (charIndex < subtitleFull.length) {
    typedSubtitle.value += subtitleFull.charAt(charIndex)
    charIndex++
    setTimeout(typeWriter, 50)
  }
}
setTimeout(typeWriter, 500)
</script>

<template>
  <div class="h-full flex flex-col font-mono text-sm">
    <!-- Header panel Editor File -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4 select-none shrink-0">
      <div class="flex items-center space-x-2 text-slate-400">
        <span class="text-xs"> src / views / editor / README.md</span>
      </div>
    </div>

    <!-- AREA UTAMA -->
    <div class="flex-1 overflow-y-auto">
      
      <!-- MODE RAW CODE (Markdown Text View) -->
      <div v-if="!isPreviewMode" class="space-y-1 leading-relaxed text-left">
        <div v-for="(line, idx) in rawMarkdownLines" :key="idx" class="flex">
          <span class="w-10 text-slate-600 text-right pr-4 select-none text-xs">{{ idx + 1 }}</span>
          <span class="flex-1 whitespace-pre" v-html="highlightMarkdownLine(line)"></span>
        </div>
      </div>

      <!-- MODE PREVIEW (Visual Profile) -->
      <div v-else class="font-mono space-y-6 pb-8">
        
        <!-- Baris Atas: Foto Profil & Info Cepat -->
        <div class="flex flex-col lg:flex-row items-center lg:items-start gap-6 pb-6 border-b border-slate-800/40">
          
          <!-- Foto Profil -->
          <div class="relative group select-none shrink-0">
            <div class="relative w-32 h-32 rounded-full overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center">
              <img 
                :src="githubStore.profileData?.avatarUrl || PROFILE.avatarUrl" 
                :alt="PROFILE.name"
                class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                @click="isZoomed = true"
                title="Perbesar Foto"
              />
            </div>
          </div>

          <!-- Informasi Profil Ringkas -->
          <div class="text-center lg:text-left space-y-3">
            <div class="space-y-1">
              <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
                {{ PROFILE.name }}
              </h1>
              <p class="text-sm md:text-base font-mono text-cyan-400 min-h-[1.5rem]">
                {{ typedSubtitle }}<span class="animate-pulse duration-700">|</span>
              </p>
            </div>
            
            <p class="text-slate-300 text-xs md:text-sm leading-relaxed">
              {{ PROFILE.bio }}
            </p>
            
            <!-- Lokasi & Status Kerja -->
            <div class="flex flex-wrap justify-center lg:justify-start gap-3 pt-1 text-xs font-mono">
              <span class="bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded text-slate-400">
                 {{ PROFILE.location }}
              </span>
            </div>
          </div>
        </div>

        <!-- Baris Bawah: Tentang Saya & Fokus -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          <!-- Box: My Mission -->
          <div class="p-4 rounded-lg bg-slate-900/40 border border-slate-800/40 space-y-2 shadow-lg shadow-white/5">
            <h3 class="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono"> Filosofi Kerja</h3>
            <p class="text-slate-300 text-xs leading-relaxed">
              {{ PROFILE.mission }}
            </p>
          </div>

          <!-- Box: Quick Badges -->
          <div class="p-4 rounded-lg bg-slate-900/40 border border-slate-800/40 space-y-3 shadow-lg shadow-white/5">
            <h3 class="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono"> Core Stack</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="interest in PROFILE.interests" :key="interest" class="bg-[#111111] border border-[#222222] text-slate-300 px-2.5 py-1 rounded text-xs">
                {{ interest }}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <!-- Overlay Zoom Foto -->
    <transition name="fade-editor">
      <div 
        v-if="isZoomed" 
        class="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        @click="isZoomed = false"
      >
        <img 
          :src="githubStore.profileData?.avatarUrl || PROFILE.avatarUrl" 
          alt="Avatar Zoomed" 
          class="max-w-full max-h-[80vh] rounded-2xl shadow-2xl shadow-cyan-500/20"
          @click.stop
        />
      </div>
    </transition>
  </div>
</template>
