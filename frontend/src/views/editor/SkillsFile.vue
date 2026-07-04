<script setup>
import { ref, onMounted } from 'vue'
import { VIRTUAL_FILES } from '@/constants/files'

const isPreviewMode = ref(true)
const animateProgress = ref(false)

onMounted(() => {
  // Memicu animasi progress bar setelah render selesai
  setTimeout(() => {
    animateProgress.value = true
  }, 100)
})

// Kategori keahlian riil untuk dirender di mode Preview
const skillsCategories = [
  {
    title: 'Frontend Development',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    glowColor: 'group-hover:shadow-cyan-500/10',
    skills: [
      { name: 'Vue.js 3 (Composition API & Pinia)', level: 90 },
      { name: 'React & Next.js', level: 85 },
      { name: 'Tailwind CSS v4 & PostCSS', level: 95 },
      { name: 'TypeScript / JavaScript (ES6+)', level: 88 }
    ]
  },
  {
    title: 'Backend & Serverless',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    glowColor: 'group-hover:shadow-purple-500/10',
    skills: [
      { name: 'Node.js runtime (ESM)', level: 85 },
      { name: 'Vercel Serverless Functions', level: 90 },
      { name: 'Express.js & REST API Design', level: 88 },
      { name: 'Go (Golang) basics', level: 60 }
    ]
  },
  {
    title: 'Databases & DevOps',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/20',
    glowColor: 'group-hover:shadow-yellow-500/10',
    skills: [
      { name: 'PostgreSQL / MySQL', level: 82 },
      { name: 'MongoDB & Redis caching', level: 80 },
      { name: 'Docker & Containerization', level: 75 },
      { name: 'Git & GitHub Actions (CI/CD)', level: 85 }
    ]
  }
]

// Soft skills bergaya terminal output
const softSkills = [
  { key: 'problem-solving', value: 'High' },
  { key: 'system-design', value: 'Scalable & Maintainable' },
  { key: 'collaboration', value: 'Excellent' },
  { key: 'mentorship', value: 'Senior Level' }
]

// Mewarnai baris kode CSS untuk mode Source Code
const highlightCssLine = (line) => {
  let html = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Warnai Komentar CSS (/* ... */)
  html = html.replace(/(\/\*.*?\*\/)/g, '<span class="text-[#5c6370] italic">$1</span>')

  // Warnai Selector Class (contoh: .frontend-skills)
  html = html.replace(/^(\.[a-zA-Z0-9_-]+)/g, '<span class="text-[#61afef] font-bold">$1</span>')

  // Warnai Properti CSS sebelum titik dua (contoh: frameworks:)
  html = html.replace(/([a-zA-Z0-9_-]+):/g, '<span class="text-[#e06c75]">$1</span>:')

  // Warnai Nilai Properti setelah titik dua sebelum titik koma (contoh: : Vue3, React;)
  html = html.replace(/: \s*([^;]+)/g, ': <span class="text-[#98c379]">$1</span>')

  // Warnai Kurung Kurawal & Titik Koma ({ } ;)
  html = html.replace(/([\{\};])/g, '<span class="text-[#c678dd] font-bold">$1</span>')

  return html
}

const rawLines = VIRTUAL_FILES.skills.raw.split('\n')
</script>

<template>
  <div class="h-full flex flex-col font-mono text-sm">
    <!-- Header panel Editor File -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4 select-none shrink-0">
      <div class="flex items-center space-x-2 text-slate-400">
        <span class="text-xs">📂 src / views / editor / skills.css</span>
      </div>
      
      <!-- Tombol Toggle Preview -->
      <button 
        @click="isPreviewMode = !isPreviewMode"
        class="flex items-center space-x-1.5 py-1 px-3 rounded bg-slate-800/80 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-400 border border-slate-700/60 hover:border-cyan-800/80 transition-all text-xs interactive"
      >
        <span>{{ isPreviewMode ? '📝 Show Source' : '👁️ Open Preview' }}</span>
      </button>
    </div>

    <!-- AREA UTAMA -->
    <div class="flex-1 overflow-y-auto">
      
      <!-- MODE RAW CODE (CSS Editor View) -->
      <div v-if="!isPreviewMode" class="space-y-0.5 leading-6 text-left">
        <div v-for="(line, idx) in rawLines" :key="idx" class="flex">
          <span class="w-10 text-slate-600 text-right pr-4 select-none text-xs">{{ idx + 1 }}</span>
          <span class="flex-1 whitespace-pre" v-html="highlightCssLine(line)"></span>
        </div>
      </div>

      <!-- MODE PREVIEW (Skills Dashboard Visual) -->
      <div v-else class="font-sans space-y-6">
        
        <!-- Grid Keahlian Teknis -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div 
            v-for="category in skillsCategories" 
            :key="category.title"
            class="p-5 rounded-lg bg-slate-900/30 border flex flex-col justify-between transition-all group hover:bg-[#0f172a]/40"
            :class="[category.borderColor, category.glowColor]"
          >
            <div>
              <!-- Kategori Title -->
              <h3 class="text-sm font-bold tracking-wider font-mono uppercase pb-4 border-b border-slate-800/40 mb-4 text-left" :class="category.color">
                // {{ category.title }}
              </h3>
              
              <!-- Progress Bars -->
              <div class="space-y-4">
                <div v-for="skill in category.skills" :key="skill.name" class="space-y-1.5 text-left">
                  <div class="flex justify-between text-xs font-mono">
                    <span class="text-slate-300 font-medium">{{ skill.name }}</span>
                    <span class="text-slate-500">{{ skill.level }}%</span>
                  </div>
                  <!-- Progress Bar BG -->
                  <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                    <!-- Progress Bar Filler (Animated Width) -->
                    <div 
                      class="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r"
                      :class="[
                        category.title.includes('Frontend') ? 'from-cyan-500 to-blue-500' : 
                        category.title.includes('Backend') ? 'from-purple-500 to-indigo-500' : 'from-yellow-500 to-amber-500'
                      ]"
                      :style="{ width: animateProgress ? `${skill.level}%` : '0%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bagian Bawah: Soft Skills (Bergaya Terminal Printout) -->
        <div class="p-5 rounded-lg bg-slate-950/60 border border-slate-900/80 font-mono text-left space-y-3">
          <div class="flex items-center space-x-2 text-xs text-slate-500 select-none pb-2 border-b border-slate-900/60">
            <span class="text-yellow-500">⬤</span>
            <span class="text-green-500">⬤</span>
            <span class="text-cyan-500">⬤</span>
            <span class="ml-2">system_evaluation_metrics.log</span>
          </div>
          
          <div class="space-y-1 text-xs md:text-sm">
            <p class="text-slate-500">&gt; cat soft_skills_status.json</p>
            <div class="pl-4 text-emerald-400 space-y-1">
              <p>{</p>
              <p v-for="skill in softSkills" :key="skill.key" class="pl-4">
                <span class="text-purple-400">"{{ skill.key }}"</span>: 
                <span class="text-yellow-400">"{{ skill.value }}"</span>,
              </p>
              <p>}</p>
            </div>
            <div class="flex items-center space-x-1.5 pt-2 text-slate-500 animate-pulse">
              <span>$</span>
              <span class="w-2 h-4 bg-slate-500 inline-block"></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
/* Transisi progress bar */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
