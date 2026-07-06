<script setup>
import { ref, onMounted, computed } from 'vue'
import { useGithubStore } from '@/stores/github'
import { PROFILE } from '@/constants/profile'
import EditorFileHeader from '@/components/common/EditorFileHeader.vue'
const githubStore = useGithubStore()
const animateProgress = ref(false)

onMounted(() => {
  setTimeout(() => {
    animateProgress.value = true
  }, 100)
})

// 1. Menghitung skill dinamis berdasarkan bahasa pemrograman dari GitHub Repositories
const dynamicSkills = computed(() => {
  if (!githubStore.profileData?.repositories?.nodes) return []
  
  const langs = {}
  let totalRepos = 0
  
  githubStore.profileData.repositories.nodes.forEach(repo => {
    if (repo.primaryLanguage) {
      const name = repo.primaryLanguage.name
      const color = repo.primaryLanguage.color
      if (!langs[name]) langs[name] = { count: 0, color }
      langs[name].count++
      totalRepos++
    }
  })
  
  const skillsArray = Object.keys(langs).map(key => ({
    name: key,
    color: langs[key].color,
    count: langs[key].count,
    level: Math.round((langs[key].count / totalRepos) * 100)
  }))
  
  return skillsArray.sort((a, b) => b.level - a.level)
})

// 2. Ekosistem Framework & Library Detail (Dari Pusat Data)
const detailedEcosystem = PROFILE.frameworkEcosystem

const softSkills = PROFILE.softSkills


</script>

<template>
  <div class="h-full flex flex-col font-mono text-sm">
    <EditorFileHeader path="skills.css" />

    <div class="flex-1 overflow-y-auto pr-2">

      <div class="font-mono space-y-8 pb-8">
        
        <!-- Live GitHub Languages -->
        <div class="p-6 rounded-lg bg-slate-900/30 border border-slate-800/60 transition-all text-left shadow-lg shadow-white/5">
          <h3 class="text-sm font-bold tracking-wider font-mono uppercase pb-4 border-b border-slate-800/40 mb-6 flex items-center space-x-2 text-slate-300">
            <span>GitHub Languages Distribution</span>
          </h3>
          
          <div v-if="dynamicSkills.length === 0" class="text-slate-500 text-sm font-mono animate-pulse">
            Loading languages from GitHub...
          </div>
          
          <div v-else class="space-y-5 max-w-3xl">
            <div v-for="skill in dynamicSkills" :key="skill.name" class="space-y-2">
              <div class="flex justify-between text-xs font-mono">
                <div class="flex items-center space-x-2">
                  <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: skill.color }"></span>
                  <span class="text-slate-300 font-medium">{{ skill.name }}</span>
                </div>
                <div class="text-slate-400">
                  <span class="text-slate-500 mr-2">({{ skill.count }} repo)</span>
                  <span>{{ skill.level }}%</span>
                </div>
              </div>
              <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                <div 
                  class="h-full rounded-full transition-all duration-1000 ease-out"
                  :style="{ 
                    width: animateProgress ? `${skill.level}%` : '0%',
                    backgroundColor: skill.color
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Frameworks & Libraries Grid -->
        <div class="space-y-4 text-left">
          <h3 class="text-sm font-bold tracking-wider font-mono uppercase pb-2 flex items-center space-x-2 text-slate-300">
            <span>Frameworks & Libraries Ecosystem</span>
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div 
              v-for="group in detailedEcosystem" 
              :key="group.category"
              class="p-5 rounded-lg bg-slate-900/20 border flex flex-col justify-between transition-all hover:bg-slate-800/30 shadow-lg shadow-white/5 hover:shadow-white/10"
              :class="[group.borderColor]"
            >
              <div>
                <h4 class="text-xs font-bold tracking-wider font-mono uppercase pb-3 border-b border-slate-800/40 mb-4" :class="group.color">
                  // {{ group.category }}
                </h4>
                
                <div class="space-y-3.5">
                  <div v-for="item in group.items" :key="item.name" class="space-y-1.5">
                    <div class="flex justify-between text-[11px] font-mono">
                      <span class="text-slate-300">{{ item.name }}</span>
                      <span class="text-slate-500">{{ item.level }}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/30">
                      <div 
                        class="h-full rounded-full transition-all duration-1000 ease-out bg-current"
                        :class="group.color"
                        :style="{ width: animateProgress ? `${item.level}%` : '0%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Soft Skills -->
        <div class="p-5 rounded-lg bg-slate-950/60 border border-slate-900/80 font-mono text-left space-y-3 shadow-lg shadow-white/5">
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
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.duration-1000 {
  transition-duration: 1000ms;
}
</style>
