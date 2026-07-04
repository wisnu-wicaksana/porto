<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useGithubStore } from '@/stores/github'

const router = useRouter()
const githubStore = useGithubStore()

// State
const inputRef = ref(null)
const currentInput = ref('')
const commandHistory = ref([])
const isMobileKeyboardOpen = ref(false) // Untuk mendeteksi fokus di mobile

const ASCII_BANNER = `
 __      _______  _____ _   _ _    _ 
 \\ \\    / /_   _|/ ____| \\ | | |  | |
  \\ \\  / /  | | | (___ |  \\| | |  | |
   \\ \\/ /   | |  \\___ \\| . \` | |  | |
    \\  /   _| |_ ____) | |\\  | |__| |
     \\/   |_____|_____/|_| \\_|\\____/ 
                                     
Welcome to Wisnu's Terminal Portfolio v1.0.0
Type 'help' to see available commands.
`

// Inisialisasi Terminal
onMounted(() => {
  commandHistory.value.push({ type: 'output', text: ASCII_BANNER, isAscii: true })
  focusInput()
  // Fetch profil GitHub di background (berjaga-jaga jika user langsung masuk ke /terminal)
  githubStore.fetchProfile()
})

// Fungsi memfokuskan input (terutama untuk mobile keyboard)
const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

// Handler saat command disubmit
const handleCommand = async (e) => {
  // Cegah default form submission
  e?.preventDefault()
  
  const cmd = currentInput.value.trim().toLowerCase()
  if (!cmd) return

  // Tambahkan input user ke histori
  commandHistory.value.push({ type: 'input', text: `visitor@wisnu-desktop:~$ ${cmd}` })
  currentInput.value = ''

  // Scroll ke bawah
  scrollToBottom()

  // Routing perintah (Command execution)
  await executeCommand(cmd)
}

// Fungsi eksekusi perintah (Bisa dipanggil oleh text input atau quick action button)
const executeCommand = async (cmd) => {
  // Jika dipanggil dari tombol cepat (bukan dari input field)
  if (currentInput.value !== '') {
    commandHistory.value.push({ type: 'input', text: `visitor@wisnu-desktop:~$ ${cmd}` })
    currentInput.value = ''
  }

  switch (cmd) {
    case 'help':
      commandHistory.value.push({ 
        type: 'output', 
        text: `Available commands:
  help      - Show this help message
  about     - Show brief information about me
  projects  - List my top GitHub repositories (Live Data)
  skills    - Display my technical skills
  contact   - Show contact information
  clear     - Clear the terminal screen
  editor    - Switch back to the VS Code GUI mode
  gui       - Alias for 'editor'`
      })
      break

    case 'about':
      commandHistory.value.push({ 
        type: 'output', 
        text: `Hi! I'm Wisnu Wicaksana.
A Senior Fullstack Developer & System Architect based in Jakarta, Indonesia.
I specialize in building high-performance web applications, scalable APIs, 
and clean system architectures using modern technologies like Vue 3, React, 
Node.js, and Serverless frameworks.

My philosophy: "Code is an instrument to solve real problems efficiently."` 
      })
      break

    case 'projects':
      commandHistory.value.push({ type: 'output', text: 'Fetching repositories from GitHub API...' })
      scrollToBottom()
      
      if (githubStore.loading) {
        // Tunggu sebentar jika sedang loading
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      if (githubStore.profileData && githubStore.profileData.repositories?.nodes?.length) {
        let projText = `\n[ MY REPOSITORIES - @${githubStore.profileData.login} ]\n\n`
        
        githubStore.profileData.repositories.nodes.forEach(repo => {
          const lang = repo.primaryLanguage ? repo.primaryLanguage.name : 'Unknown'
          projText += `* ${repo.name}\n`
          projText += `  Desc: ${repo.description || 'No description'}\n`
          projText += `  Tech: ${lang} | Stars: ${repo.stargazerCount} | Forks: ${repo.forkCount}\n`
          projText += `  Link: ${repo.url}\n\n`
        })

        commandHistory.value.push({ type: 'output', text: projText })
      } else {
        // Fallback jika API gagal
        commandHistory.value.push({ 
          type: 'output', 
          text: `[ OFFLINE MODE ]
Failed to fetch live data from GitHub. Showing local fallback:

* porto-monorepo
  Desc: Web portofolio interaktif dengan desain UI/UX bertema Programmer.
  Tech: Vue 3, Tailwind v4, Vercel
  
* secure-api-proxy
  Desc: Fungsi serverless aman untuk menyembunyikan API token.
  Tech: Node.js, GraphQL` 
        })
      }
      break

    case 'skills':
      if (githubStore.profileData?.repositories?.nodes) {
        let skillsText = `[ GITHUB LANGUAGES DISTRIBUTION ]\n\n`
        
        const langs = {}
        let totalRepos = 0
        
        githubStore.profileData.repositories.nodes.forEach(repo => {
          if (repo.primaryLanguage) {
            const name = repo.primaryLanguage.name
            if (!langs[name]) langs[name] = 0
            langs[name]++
            totalRepos++
          }
        })
        
        const skillsArray = Object.keys(langs).map(key => ({
          name: key,
          level: Math.round((langs[key] / totalRepos) * 100)
        })).sort((a, b) => b.level - a.level)
        
        skillsArray.forEach(skill => {
          const filled = Math.round(skill.level / 10)
          const empty = 10 - filled
          const bar = '█'.repeat(filled) + '░'.repeat(empty)
          skillsText += `${skill.name.padEnd(16)} [${bar}] ${skill.level}%\n`
        })

        // Menambahkan Detail Framework & Library
        skillsText += `\n[ FRAMEWORKS & LIBRARIES ECOSYSTEM ]\n\n`
        skillsText += `Frontend:\n`
        skillsText += `Vue.js 3         [█████████░] 90%\n`
        skillsText += `Tailwind CSS v4  [█████████░] 95%\n`
        skillsText += `React & Next.js  [████████░░] 85%\n`
        skillsText += `Pinia & Redux    [████████░░] 88%\n\n`
        
        skillsText += `Backend & API:\n`
        skillsText += `Node.js (ESM)    [████████░░] 88%\n`
        skillsText += `Express & REST   [████████░░] 85%\n`
        skillsText += `Vercel Functions [█████████░] 90%\n\n`

        skillsText += `Database & DevOps:\n`
        skillsText += `PostgreSQL       [████████░░] 82%\n`
        skillsText += `Docker & CI/CD   [███████░░░] 75%\n`
        
        commandHistory.value.push({ type: 'output', text: skillsText })
      } else {
        commandHistory.value.push({ type: 'output', text: 'Still loading data from GitHub. Please try again in a moment.' })
      }
      break

    case 'contact':
      commandHistory.value.push({ 
        type: 'output', 
        text: `[ CONTACT INFO ]
Email   : wisnu.wicaksana@example.com
GitHub  : github.com/wisnu-wicaksana
Address : Jakarta, Indonesia

Type 'editor' and go to contact.sh to send a direct message!` 
      })
      break

    case 'clear':
      commandHistory.value = []
      break

    case 'editor':
    case 'gui':
      commandHistory.value.push({ type: 'output', text: 'Initializing graphical user interface (GUI)...' })
      setTimeout(() => {
        router.push('/editor')
      }, 500)
      break

    default:
      commandHistory.value.push({ 
        type: 'output', 
        text: `bash: ${cmd}: command not found. Type 'help' for a list of commands.` 
      })
  }
  
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  })
}

// Fungsi eksekusi dari tombol cepat (Mobile Touch-Bar)
const executeQuickCommand = (cmd) => {
  executeCommand(cmd)
  focusInput()
}
</script>

<template>
  <div 
    class="min-h-screen w-full bg-[#020617] text-[#22c55e] font-mono text-sm md:text-base relative overflow-x-hidden crt-effect"
    @click="focusInput"
  >
    <!-- Overlay Scanline CRT -->
    <div class="pointer-events-none fixed inset-0 z-10 scanlines opacity-10"></div>
    
    <div class="p-4 md:p-6 pb-24 md:pb-8 w-full max-w-5xl mx-auto">
      
      <!-- Command History Output -->
      <div class="space-y-2 mb-4">
        <div 
          v-for="(item, index) in commandHistory" 
          :key="index"
          class="break-words whitespace-pre-wrap"
          :class="{
            'text-emerald-300 font-bold': item.type === 'input',
            'text-[#22c55e]': item.type === 'output',
            'leading-tight md:leading-normal': item.isAscii
          }"
        >{{ item.text }}</div>
      </div>

      <!-- Current Input Line -->
      <form @submit.prevent="handleCommand" class="flex items-center space-x-2">
        <span class="text-emerald-300 font-bold shrink-0">visitor@wisnu-desktop:~$</span>
        <input 
          ref="inputRef"
          v-model="currentInput"
          type="text"
          class="flex-1 bg-transparent border-none outline-none text-[#22c55e] font-mono shadow-none caret-emerald-400"
          autocomplete="off"
          spellcheck="false"
          autofocus
          @focus="isMobileKeyboardOpen = true"
          @blur="isMobileKeyboardOpen = false"
        />
      </form>
    </div>

    <!-- Quick Commands Touch-Bar (Tampil di Mobile untuk UX lebih baik) -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-[#020617]/90 border-t border-emerald-900/50 p-2 overflow-x-auto whitespace-nowrap scrollbar-none z-20 backdrop-blur-sm">
      <div class="flex space-x-2 items-center px-1">
        <span class="text-[9px] text-emerald-600/80 mr-1 uppercase">Quick:</span>
        <button @click.stop="executeQuickCommand('help')" class="px-3 py-1.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 text-xs active:bg-emerald-900">help</button>
        <button @click.stop="executeQuickCommand('about')" class="px-3 py-1.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 text-xs active:bg-emerald-900">about</button>
        <button @click.stop="executeQuickCommand('projects')" class="px-3 py-1.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 text-xs active:bg-emerald-900">projects</button>
        <button @click.stop="executeQuickCommand('skills')" class="px-3 py-1.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 text-xs active:bg-emerald-900">skills</button>
        <button @click.stop="executeQuickCommand('clear')" class="px-3 py-1.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 text-xs active:bg-emerald-900">clear</button>
        <button @click.stop="executeQuickCommand('editor')" class="px-3 py-1.5 rounded bg-emerald-700 text-[#020617] font-bold border border-emerald-500 text-xs active:bg-emerald-600">GUI</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Menghapus outline fokus biru default pada input teks */
input:focus {
  outline: none;
  box-shadow: none;
}

/* Kursor berkedip simulasi jika dibutuhkan */
.caret-emerald-400 {
  caret-color: #34d399; /* Tailwind emerald-400 */
}

/* Sembunyikan scrollbar pada area navigasi sentuh */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Efek Layar CRT Monitor Klasik */
.scanlines {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.2)
  );
  background-size: 100% 4px;
}

/* Animasi Flicker Tipis */
.crt-effect {
  animation: flicker 0.15s infinite;
  text-shadow: 0 0 2px rgba(34, 197, 94, 0.5); /* Glow hijau tipis */
}

@keyframes flicker {
  0% { opacity: 0.97; }
  50% { opacity: 1; }
  100% { opacity: 0.98; }
}
</style>
