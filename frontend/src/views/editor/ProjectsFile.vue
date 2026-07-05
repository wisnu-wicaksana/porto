<script setup>
import { ref, onMounted, computed } from 'vue'
import { useGithubStore } from '@/stores/github'
import { VIRTUAL_FILES } from '@/constants/files'

const isPreviewMode = ref(true)
const isZoomed = ref(false)
const githubStore = useGithubStore()

onMounted(async () => {
  // Panggil fetch profile jika belum ada data (handling hard refresh)
  await githubStore.fetchProfile()
})

// Parsing isi JSON lokal sebagai fallback
const localProjects = computed(() => {
  try {
    const parsed = JSON.parse(VIRTUAL_FILES.projects.raw)
    return parsed.featured_projects || []
  } catch (e) {
    console.error('Failed to parse local projects:', e)
    return []
  }
})

// Fungsi mewarnai baris JSON untuk Mode Source Code
const highlightJsonLine = (line) => {
  // Bersihkan tag HTML berbahaya
  let html = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Warnai Kunci/Key (contoh: "name":)
  html = html.replace(/"([^"]+)":/g, '<span class="text-[#e06c75]">"$1"</span>:')

  // Warnai Nilai String (contoh: : "In Development")
  // Regex mencocokkan apa saja setelah titik dua (:) diikuti tanda kutip
  html = html.replace(/: \s*"([^"]*)"/g, ': <span class="text-[#98c379]">"$1"</span>')

  // Warnai Angka, Boolean, Null
  html = html.replace(/: \s*(true|false|null|\d+)/g, ': <span class="text-[#d19a66] font-bold">$1</span>')

  // Warnai Kurung Kurawal & Kurung Siku
  html = html.replace(/([{}[\]])/g, '<span class="text-[#e5c07b]">$1</span>')

  return html
}

const rawLines = computed(() => VIRTUAL_FILES.projects.raw.split('\n'))
</script>

<template>
  <div class="h-full flex flex-col font-mono text-sm">
    <!-- Header panel Editor File -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4 select-none shrink-0">
      <div class="flex items-center space-x-2 text-slate-400">
        <span class="text-xs"> src / views / editor / projects.json</span>
      </div>
    </div>

    <!-- AREA UTAMA -->
    <div class="flex-1 overflow-y-auto">
      
      <!-- MODE RAW CODE (JSON Highlighting) -->
      <div v-if="!isPreviewMode" class="space-y-0.5 leading-6 text-left">
        <div v-for="(line, idx) in rawLines" :key="idx" class="flex">
          <span class="w-10 text-slate-600 text-right pr-4 select-none text-xs">{{ idx + 1 }}</span>
          <span class="flex-1 whitespace-pre" v-html="highlightJsonLine(line)"></span>
        </div>
      </div>

      <!-- MODE PREVIEW (GitHub API Dashboard) -->
      <div v-else class="font-mono space-y-6">
        
        <!-- Loading State -->
        <div v-if="githubStore.loading" class="flex flex-col items-center justify-center py-16 space-y-4">
          <div class="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-slate-400 font-mono text-xs animate-pulse">fetching_github_api_data...</p>
        </div>

        <!-- Error / Offline / Token missing state -> FALLBACK VIEW -->
        <div v-else-if="githubStore.error || !githubStore.profileData" class="space-y-6">
          <div class="p-4 rounded-lg bg-yellow-950/20 border border-yellow-800/30 text-yellow-400 text-left flex items-start space-x-3 shadow-lg shadow-white/5">
            <span class="text-lg">⚠️</span>
            <div class="text-xs space-y-1">
              <p class="font-bold">Offline / Local Mode</p>
              <p class="text-slate-400">
                Gagal memuat data realtime dari GitHub (kemungkinan token .env belum dikonfigurasi). Menampilkan proyek statis dari <code class="bg-yellow-950/50 px-1 rounded text-yellow-300 font-mono">projects.json</code> lokal.
              </p>
            </div>
          </div>

          <!-- Grid Featured Projects Lokal -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono text-left"> Featured Projects (Local Source)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="project in localProjects" 
                :key="project.name"
                class="p-5 rounded-lg bg-slate-900/30 border border-slate-800/60 flex flex-col justify-between hover:border-cyan-500/40 hover:bg-cyan-950/5 transition-all text-left group shadow-lg shadow-white/5 hover:shadow-white/10"
              >
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-base font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{{ project.name }}</span>
                    <span class="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono border border-slate-700">{{ project.status }}</span>
                  </div>
                  <p class="text-xs text-slate-400 leading-relaxed">{{ project.description }}</p>
                </div>
                
                <div class="pt-4 flex flex-col space-y-3">
                  <!-- Tech stack badges -->
                  <div class="flex flex-wrap gap-1.5">
                    <span 
                      v-for="tech in project.tech_stack" 
                      :key="tech" 
                      class="text-[9px] bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded"
                    >
                      {{ tech }}
                    </span>
                  </div>
                  
                  <!-- Link -->
                  <a 
                    v-if="project.github_url" 
                    :href="project.github_url" 
                    target="_blank" 
                    class="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1.5 pt-1.5 interactive"
                  >
                    <span>View Repository</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Realtime GitHub API Mode (SUCCESS STATE) -->
        <div v-else class="space-y-8">
          
          <!-- GitHub Profile Header Summary -->
          <div class="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-slate-950/40 border border-slate-900/80 text-left shadow-lg shadow-white/5">
            <img 
              :src="githubStore.profileData.avatarUrl" 
              alt="GitHub Avatar" 
              class="w-20 h-20 rounded-full border border-cyan-500/50 shrink-0 cursor-pointer hover:scale-105 transition-transform"
              @click="isZoomed = true"
              title="Perbesar Foto"
            />
            <div class="space-y-1.5 flex-1">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 class="text-base font-bold text-slate-200">{{ githubStore.profileData.name }}</h3>
                <a :href="githubStore.profileData.websiteUrl || '#'" target="_blank" class="text-xs text-cyan-400 hover:underline interactive font-mono">
                  @{{ githubStore.profileData.login }}
                </a>
              </div>
              <p class="text-xs text-slate-400">{{ githubStore.profileData.bio }}</p>
            </div>
            
            <div class="flex gap-4 sm:border-l sm:border-slate-800/80 sm:pl-6 text-center sm:text-left">
              <div>
                <div class="text-base font-bold text-slate-200">{{ githubStore.profileData.repositories?.nodes?.length || 0 }}</div>
                <div class="text-[9px] text-slate-500 font-mono uppercase">Total Repos</div>
              </div>
              <div>
                <div class="text-base font-bold text-slate-200">6</div>
                <div class="text-[9px] text-slate-500 font-mono uppercase">Pinned</div>
              </div>
            </div>
          </div>

          <!-- My Repositories Grid -->
          <div v-if="githubStore.profileData.repositories?.nodes?.length" class="space-y-4">
            <h3 class="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono text-left flex items-center space-x-2">
              <span>📁</span>
              <span>My Repositories</span>
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="repo in githubStore.profileData.repositories.nodes" 
                :key="'recent-'+repo.name"
                class="p-4 rounded-lg bg-slate-900/10 border border-slate-800/40 flex flex-col justify-between hover:border-slate-500/40 hover:bg-slate-800/20 transition-all text-left group shadow-lg shadow-white/5 hover:shadow-white/10"
              >
                <div class="space-y-2">
                  <div class="flex justify-between items-start gap-2">
                    <span class="text-sm font-bold text-slate-300 group-hover:text-cyan-400 transition-colors truncate">
                      {{ repo.name }}
                    </span>
                    <a 
                      :href="repo.url" 
                      target="_blank" 
                      class="text-slate-600 hover:text-cyan-400 text-[10px] interactive shrink-0"
                      title="Buka di GitHub"
                    >
                      🔗
                    </a>
                  </div>
                  <p class="text-[11px] text-slate-500 leading-relaxed h-8 overflow-hidden text-ellipsis line-clamp-2">
                    {{ repo.description || 'Tidak ada deskripsi.' }}
                  </p>
                </div>
                
                <div class="pt-3 flex items-center justify-between border-t border-slate-900/30 mt-3 text-[10px] font-mono text-slate-500 select-none">
                  <!-- Language -->
                  <div v-if="repo.primaryLanguage" class="flex items-center space-x-1.5">
                    <span 
                      class="w-2 h-2 rounded-full inline-block"
                      :style="{ backgroundColor: repo.primaryLanguage.color }"
                    ></span>
                    <span>{{ repo.primaryLanguage.name }}</span>
                  </div>
                  <span v-else class="text-slate-600">Unspecified</span>
                  
                  <!-- Stars / Forks -->
                  <div class="flex items-center space-x-2">
                    <span class="flex items-center space-x-1">
                      <span>★</span>
                      <span>{{ repo.stargazerCount }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </div>

    </div>
    
    <!-- Overlay Zoom Foto -->
    <transition name="fade-editor">
      <div 
        v-if="isZoomed && githubStore.profileData" 
        class="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        @click="isZoomed = false"
      >
        <img 
          :src="githubStore.profileData.avatarUrl" 
          alt="GitHub Avatar Zoomed" 
          class="max-w-full max-h-[80vh] rounded-2xl shadow-2xl shadow-cyan-500/20"
          @click.stop
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Menghilangkan scrollbar pada area rendering */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
