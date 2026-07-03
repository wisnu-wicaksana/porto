import { ref } from 'vue'
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

  return {
    profileData,
    loading,
    error,
    fetchProfile
  }
})
