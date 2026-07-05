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
          
          <!-- Box: About Me -->
          <div class="p-4 rounded-lg bg-slate-900/40 border border-slate-800/40 space-y-2 shadow-lg shadow-white/5">
            <h3 class="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono"> About Me</h3>
            <p class="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
              {{ PROFILE.about }}
            </p>
          </div>

          <!-- Box: Social Links -->
          <div class="p-4 rounded-lg bg-slate-900/40 border border-slate-800/40 space-y-3 shadow-lg shadow-white/5 flex flex-col justify-start">
            <h3 class="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono"> Let's Connect</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a :href="`mailto:${PROFILE.contact.email}`" target="_blank" class="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span class="truncate">Email</span>
              </a>
              <a :href="PROFILE.contact.github" target="_blank" class="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span class="truncate">GitHub</span>
              </a>
              <a :href="PROFILE.contact.linkedin" target="_blank" class="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <span class="truncate">LinkedIn</span>
              </a>
              <a :href="PROFILE.contact.instagram" target="_blank" class="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span class="truncate">Instagram</span>
              </a>
              <a :href="PROFILE.contact.threads" target="_blank" class="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800/50 transition-colors">
                <span class="w-4 h-4 flex items-center justify-center font-bold text-[16px] leading-none shrink-0" style="font-family: system-ui, -apple-system, sans-serif;">@</span>
                <span class="truncate">Threads</span>
              </a>
              <a :href="PROFILE.contact.facebook" target="_blank" class="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                <span class="truncate">Facebook</span>
              </a>
              <a :href="PROFILE.contact.whatsapp" target="_blank" class="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.42 0c-6.307 0-11.42 5.114-11.42 11.42 0 2.016.536 3.966 1.554 5.69l-1.55 5.659 5.794-1.519c1.65.952 3.518 1.45 5.424 1.45 6.307 0 11.42-5.114 11.42-11.42C22.84 5.114 17.727 0 11.42 0zm0 19.344c-1.688 0-3.34-.452-4.792-1.31l-.343-.204-3.562.934.952-3.473-.223-.355A9.458 9.458 0 0 1 1.954 11.42C1.954 6.2 6.2 1.954 11.42 1.954c5.22 0 9.466 4.246 9.466 9.466 0 5.22-4.246 9.466-9.466 9.466zM16.6 13.91c-.284-.143-1.68-.831-1.94-.925-.26-.095-.45-.143-.64.143-.19.285-.733.925-.898 1.116-.166.19-.333.214-.617.071-1.666-.831-2.92-1.916-4.004-3.832-.167-.285.033-.423.176-.566.128-.128.285-.333.427-.5.142-.166.19-.285.285-.475.095-.19.047-.356-.024-.5-.071-.142-.64-1.543-.876-2.114-.231-.555-.466-.48-.64-.488-.166-.008-.356-.008-.546-.008-.19 0-.5.071-.762.356-.26.285-1.002.981-1.002 2.392s1.026 2.775 1.168 2.966c.142.19 2.023 3.088 4.901 4.331.687.296 1.223.473 1.642.605.69.164 1.318.14 1.815.085.56-.062 1.68-.686 1.917-1.35.237-.665.237-1.236.166-1.355-.071-.119-.26-.19-.544-.333z"/></svg>
                <span class="truncate">WhatsApp</span>
              </a>
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
