import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGithubStore = defineStore('github', () => {
  const profileData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchProfile = async () => {
    // Hindari melakukan fetch ulang jika data sudah ada di state
    if (profileData.value) return

    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/github')
      if (!response.ok) {
        throw new Error(`Gagal memuat data GitHub: ${response.statusText}`)
      }
      const data = await response.json()
      profileData.value = data
    } catch (err) {
      error.value = err.message || 'Terjadi kesalahan saat mengambil data.'
      console.error('Error fetching github profile:', err)
    } finally {
      loading.value = false
    }
  }

  const languageStats = computed(() => {
    if (!profileData.value?.repositories?.nodes) return []
    
    const langs = {}
    let totalRepos = 0
    
    profileData.value.repositories.nodes.forEach(repo => {
      if (repo.primaryLanguage) {
        const name = repo.primaryLanguage.name
        const color = repo.primaryLanguage.color || '#ffffff'
        if (!langs[name]) langs[name] = { count: 0, color }
        langs[name].count++
        totalRepos++
      }
    })
    
    return Object.keys(langs).map(key => ({
      name: key,
      color: langs[key].color,
      count: langs[key].count,
      level: Math.round((langs[key].count / totalRepos) * 100)
    })).sort((a, b) => b.level - a.level)
  })

  return {
    profileData,
    loading,
    error,
    languageStats,
    fetchProfile
  }
})
