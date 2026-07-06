<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useGithubStore } from '@/stores/github'
import TerminalSnake from '@/components/TerminalSnake.vue'
import { useTerminalCommands } from '@/composables/useTerminalCommands'

const githubStore = useGithubStore()

// State
const inputRef = ref(null)
const currentInput = ref('')
const isMobileKeyboardOpen = ref(false)

const WELCOME_TEXT = `Welcome to Wisnu's Terminal Portfolio v1.0.0\nType 'help' to see available commands.`

const scrollToBottom = () => {
  nextTick(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  })
}

const { commandHistory, executeCommand } = useTerminalCommands(scrollToBottom, (cmd) => {
  if (currentInput.value !== '') {
    commandHistory.value.push({ type: 'input', text: `visitor@wisnu-desktop:~$ ${cmd}` })
    currentInput.value = ''
  }
})

const focusInput = () => {
  if (inputRef.value && window.innerWidth >= 768) {
    inputRef.value.focus()
  }
}

const resetScrolls = () => {
  window.scrollTo(0, 0)
  document.body.scrollLeft = 0
  const appDiv = document.getElementById('app')
  if (appDiv) appDiv.scrollLeft = 0
  document.querySelectorAll('.overflow-x-hidden').forEach(el => {
    el.scrollLeft = 0
  })
}

onMounted(() => {
  commandHistory.value.push({ type: 'output', text: WELCOME_TEXT, isAscii: false })
  
  resetScrolls()
  setTimeout(resetScrolls, 100)
  setTimeout(resetScrolls, 400)

  setTimeout(() => {
    focusInput()
  }, 400)

  githubStore.fetchProfile()
})

const handleCommand = async (e) => {
  e?.preventDefault()
  const cmd = currentInput.value.trim().toLowerCase()
  if (!cmd) return

  commandHistory.value.push({ type: 'input', text: `visitor@wisnu-desktop:~$ ${cmd}` })
  currentInput.value = ''
  scrollToBottom()

  await executeCommand(cmd)
}
</script>

<template>
  <div 
    class="min-h-screen w-full bg-[#020617] text-[#22c55e] font-mono text-sm md:text-base relative overflow-x-hidden crt-effect"
    @click="focusInput"
  >
    <!-- Overlay Scanline CRT -->
    <div class="pointer-events-none fixed inset-0 z-10 scanlines opacity-10"></div>
    
    <div class="p-4 md:p-6 pb-24 md:pb-8 w-full max-w-5xl mx-0 md:mx-auto">
      
      <!-- Command History Output -->
      <div class="space-y-2 mb-4">
        <div 
          v-for="(item, index) in commandHistory" 
          :key="index"
          :class="{
            'whitespace-pre-wrap break-words': item.type !== 'component' && !item.isAscii,
            'whitespace-pre overflow-x-auto overflow-y-hidden scrollbar-none max-w-full block': item.isAscii,
            'text-emerald-300 font-bold': item.type === 'input',
            'text-[#22c55e]': item.type === 'output',
            'leading-tight md:leading-normal': item.isAscii
          }"
        >
          <template v-if="item.type === 'component' && item.component === 'snake'">
            <TerminalSnake />
          </template>
          <template v-else>
            {{ item.text }}
          </template>
        </div>
      </div>

      <!-- Current Input Line -->
      <form @submit.prevent="handleCommand" class="flex items-center space-x-2">
        <span class="text-emerald-300 font-bold shrink-0">visitor@wisnu-desktop:~$</span>
        <input 
          ref="inputRef"
          v-model="currentInput"
          type="text"
          class="flex-1 bg-transparent border-none outline-none text-[#22c55e] font-mono shadow-none caret-emerald-400 text-[16px] md:text-base"
          autocomplete="off"
          spellcheck="false"
          @focus="isMobileKeyboardOpen = true"
          @blur="isMobileKeyboardOpen = false"
        />
      </form>
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
