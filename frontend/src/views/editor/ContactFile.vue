<script setup>
import { ref } from 'vue'

// State Formulir Kontak
const name = ref('')
const email = ref('')
const message = ref('')
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const isCooldown = ref(false)
const cooldownTime = ref(0)
let cooldownTimer = null

// State Console Logs Terminal (Simulatif)
const terminalLogs = ref([
  { type: 'info', text: 'Initializing contact session...' },
  { type: 'input', text: 'Ready. Waiting for user input via form...' }
])

// Tambah log ke console
const addLog = (type, text) => {
  terminalLogs.value.push({ type, text })
  // Scroll log otomatis ke paling bawah jika overflow
  setTimeout(() => {
    const el = document.getElementById('console-log-box')
    if (el) el.scrollTop = el.scrollHeight
  }, 50)
}

// Handler submit form
const handleSend = async () => {
  if (isCooldown.value) {
    addLog('error', `FAIL: Please wait ${cooldownTime.value}s before sending another message.`)
    return
  }

  if (!name.value || !email.value || !message.value) {
    addLog('error', 'FAIL: All fields (name, email, message) are required!')
    return
  }

  isSubmitting.value = true
  submitSuccess.value = false
  
  addLog('info', `Name captured: "${name.value}"`)
  addLog('info', `Email captured: "${email.value}"`)
  addLog('info', 'Preparing JSON payload payload.json...')
  
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY, 
        name: name.value,
        email: email.value,
        message: message.value
      })
    })

    const result = await response.json()

    if (response.status === 200) {
      isSubmitting.value = false
      submitSuccess.value = true
      name.value = ''
      email.value = ''
      message.value = ''
      addLog('info', 'SUCCESS: Message securely transmitted.')
      addLog('info', 'Thank you for reaching out!')
      
      // Cooldown timer
      isCooldown.value = true
      cooldownTime.value = 60
      cooldownTimer = setInterval(() => {
        cooldownTime.value--
        if (cooldownTime.value <= 0) {
          clearInterval(cooldownTimer)
          isCooldown.value = false
          submitSuccess.value = false
        }
      }, 1000)

    } else {
      isSubmitting.value = false
      addLog('error', `ERROR: ${result.message || 'Failed to send message.'}`)
      addLog('input', 'Please try again later.')
    }
  } catch {
    isSubmitting.value = false
    addLog('error', 'ERROR: Network error. Cannot reach the server.')
    addLog('input', 'Check your internet connection and try again.')
  }
}
</script>

<template>
  <div class="h-full flex flex-col font-mono text-sm">
    <!-- Header panel Editor File -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4 select-none shrink-0">
      <div class="flex items-center space-x-2 text-slate-400">
        <span class="text-xs"> src / views / editor / contact.sh</span>
      </div>
    </div>

    <!-- AREA UTAMA -->
    <div class="flex-1 overflow-y-auto">
      
      <!-- MODE PREVIEW (Interactive Console + Contact Form) -->
      <div class="font-mono grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-stretch">
        
        <!-- Kolom Kiri: Terminal Console Logger (6/12 Grid) -->
        <div class="md:col-span-6 flex flex-col rounded-lg bg-slate-950/70 border border-slate-900 overflow-hidden min-h-[220px] shadow-lg shadow-white/5">
          <!-- Window Header Terminal -->
          <div class="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800/50 select-none">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span class="text-slate-500 text-[10px] font-mono ml-4">sh ./contact.sh</span>
          </div>
          
          <!-- Box Output Log -->
          <div 
            id="console-log-box"
            class="flex-1 p-4 font-mono text-[11px] space-y-2 overflow-y-auto max-h-[300px] text-left scrollbar-none"
          >
            <div 
              v-for="(log, idx) in terminalLogs" 
              :key="idx" 
              class="leading-5"
              :class="{
                'text-slate-400': log.type === 'info',
                'text-yellow-400': log.type === 'input',
                'text-cyan-400': log.type === 'post',
                'text-green-400': log.type === 'success',
                'text-red-400': log.type === 'error'
              }"
            >
              <span class="text-slate-600 select-none">[{{ new Date().toLocaleTimeString() }}]</span>
              <span class="font-bold select-none ml-1">
                {{ 
                  log.type === 'info' ? '[INFO]' : 
                  log.type === 'input' ? '[INPUT]' : 
                  log.type === 'post' ? '[POST]' : 
                  log.type === 'success' ? '[SUCCESS]' : '[ERROR]' 
                }}
              </span>
              <span class="ml-2 whitespace-pre-wrap">{{ log.text }}</span>
            </div>
            
            <!-- Prompt input simulator di terminal -->
            <div v-if="isSubmitting" class="flex items-center space-x-1.5 text-cyan-400 animate-pulse">
              <span>$ curl sending...</span>
              <span class="w-2 h-4 bg-cyan-400 inline-block"></span>
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Contact Form (6/12 Grid) -->
        <div class="md:col-span-6 flex flex-col justify-center p-5 rounded-lg bg-slate-900/30 border border-slate-800/40 text-left shadow-lg shadow-white/5">
          <h3 class="text-base font-bold text-slate-100 mb-4">
            Send Direct Message
          </h3>
          
          <form @submit.prevent="handleSend" class="space-y-4">
            <!-- Name Input -->
            <div class="space-y-1">
              <label for="name" class="text-xs text-slate-400 font-mono">sender_name:</label>
              <input 
                id="name"
                v-model="name"
                type="text" 
                placeholder="e.g. Linus Torvalds" 
                class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-cyan-500/80 transition-all font-mono"
                required
                :disabled="isSubmitting || isCooldown"
              />
            </div>
            
            <!-- Email Input -->
            <div class="space-y-1">
              <label for="email" class="text-xs text-slate-400 font-mono">sender_email:</label>
              <input 
                id="email"
                v-model="email"
                type="email" 
                placeholder="e.g. linus@git.org" 
                class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-cyan-500/80 transition-all font-mono"
                required
                :disabled="isSubmitting || isCooldown"
              />
            </div>

            <!-- Message Input -->
            <div class="space-y-1">
              <label for="message" class="text-xs text-slate-400 font-mono">message_body:</label>
              <textarea 
                id="message"
                v-model="message"
                rows="4"
                placeholder="Type your message here..." 
                class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-cyan-500/80 transition-all font-mono resize-none"
                required
                :disabled="isSubmitting || isCooldown"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              class="w-full py-2.5 rounded font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 border interactive"
              :class="
                isSubmitting ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' :
                isCooldown ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed' :
                submitSuccess ? 'bg-green-950/20 border-green-800 text-green-400 hover:bg-green-900/20' :
                'bg-cyan-950/30 border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 hover:border-cyan-500'
              "
              :disabled="isSubmitting || isCooldown"
            >
              <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isSubmitting ? './sending.sh' : isCooldown ? `Wait ${cooldownTime}s...` : submitSuccess ? 'Message Sent!' : './run_submit.sh' }}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
/* Menghilangkan scrollbar pada box log terminal */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
