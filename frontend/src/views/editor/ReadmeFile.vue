<script setup>
import { ref, onMounted } from 'vue'

// Mode tampilan: false = Code (Raw Markdown), true = Preview (Visual Render)
const isPreviewMode = ref(true)

// Logika Typewriter (Efek Mesin Ketik) untuk Subtitle
const titleText = 'Senior Fullstack Developer & System Architect'
const typedSubtitle = ref('')
let charIndex = 0

const startTypewriter = () => {
  typedSubtitle.value = ''
  charIndex = 0
  const type = () => {
    if (charIndex < titleText.length) {
      typedSubtitle.value += titleText.charAt(charIndex)
      charIndex++
      setTimeout(type, 60)
    }
  }
  type()
}

onMounted(() => {
  startTypewriter()
})

// Isi Markdown mentah untuk tampilan Raw Code
const rawMarkdownLines = [
  '# 👨‍💻 WISNU WICAKSANA',
  '',
  '> Senior Fullstack Developer & System Architect',
  '',
  '---',
  '',
  '## 🚀 About Me',
  'Halo! Saya Wisnu Wicaksana, seorang profesional di bidang pengembangan',
  'perangkat lunak yang berfokus pada pembangunan aplikasi web berkinerja tinggi,',
  'API yang skalabel, dan arsitektur sistem yang bersih.',
  '',
  'Saya sangat menyukai perpaduan antara seni pemrograman (coding) dan',
  'desain interaktif untuk menciptakan pengalaman pengguna yang luar biasa.',
  '',
  '## 🛠️ Fokus Utama',
  '- **Frontend**: Vue.js 3 (Composition API), React, Tailwind CSS',
  '- **Backend**: Node.js, Vercel Serverless, Express, Go',
  '- **Database**: PostgreSQL, MongoDB, Redis',
  '- **Prinsip**: Clean Code, DRY, SOLID, Keamanan API',
  '',
  '## 📍 Lokasi',
  'Jakarta, Indonesia',
  '',
  '## 🌐 Hubungi Saya',
  '- Email: wisnu.wicaksana@example.com',
  '- GitHub: github.com/wisnu-wicaksana'
]

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
  if (line.startsWith('- ')) {
    // Bold highlight di list item
    const boldRegex = /\*\*(.*?)\*\*/g
    const highlighted = line.replace(boldRegex, '<span class="text-yellow-500 font-semibold">$1</span>')
    return `<span class="text-slate-300">${highlighted}</span>`
  }
  if (line.startsWith('---')) {
    return `<span class="text-slate-600">${line}</span>`
  }
  return `<span class="text-slate-300">${line}</span>`
}
</script>

<template>
  <div class="h-full flex flex-col font-mono text-sm">
    <!-- Header panel Editor File -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4 select-none shrink-0">
      <div class="flex items-center space-x-2 text-slate-400">
        <span class="text-xs">📂 src / views / editor / README.md</span>
      </div>
      
      <!-- Tombol Toggle Preview (Simbol split screen / mata preview VS Code) -->
      <button 
        @click="isPreviewMode = !isPreviewMode"
        class="flex items-center space-x-1.5 py-1 px-3 rounded bg-slate-800/80 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-400 border border-slate-700/60 hover:border-cyan-800/80 transition-all text-xs interactive"
      >
        <span>{{ isPreviewMode ? '📝 Show Source' : '👁️ Open Preview' }}</span>
      </button>
    </div>

    <!-- KONTEN AREA -->
    <div class="flex-1 overflow-y-auto">
      
      <!-- MODE RAW CODE (Markdown Editor View) -->
      <div v-if="!isPreviewMode" class="space-y-0.5 leading-6 text-left">
        <div 
          v-for="(line, idx) in rawMarkdownLines" 
          :key="idx" 
          class="flex"
        >
          <!-- Nomor Baris -->
          <span class="w-10 text-slate-600 text-right pr-4 select-none text-xs">{{ idx + 1 }}</span>
          <!-- Kode Berwarna -->
          <span class="flex-1 whitespace-pre-wrap" v-html="highlightMarkdownLine(line)"></span>
        </div>
      </div>

      <!-- MODE PREVIEW (Beautiful Profile Visual) -->
      <div v-else class="font-sans space-y-6">
        
        <!-- Baris Atas: Foto Profil & Info Cepat -->
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-slate-800/40">
          
          <!-- Foto Profil dengan Bingkai Glowing Neon -->
          <div class="relative group select-none shrink-0">
            <!-- Glow Effect di belakang -->
            <div class="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <!-- Avatar Ring -->
            <div class="relative w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-400 bg-slate-900 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80" 
                alt="Wisnu Wicaksana"
                class="w-full h-full object-cover"
              />
            </div>
            <!-- Status Badge -->
            <span class="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-green-500 border-4 border-[#0d1321] flex items-center justify-center" title="Active Coding"></span>
          </div>

          <!-- Informasi Profil Ringkas -->
          <div class="text-center md:text-left space-y-3">
            <div class="space-y-1">
              <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Wisnu Wicaksana
              </h1>
              <!-- Typewriter Subtitle -->
              <p class="text-sm md:text-base font-mono text-cyan-400 h-6">
                {{ typedSubtitle }}<span class="animate-pulse duration-700">|</span>
              </p>
            </div>
            
            <p class="text-slate-400 text-xs md:text-sm font-light max-w-lg leading-relaxed">
              Saya adalah seorang fullstack developer yang suka mengubah logika kompleks menjadi antarmuka pengguna yang bersih, responsif, dan menyenangkan untuk dijelajahi.
            </p>
            
            <!-- Lokasi & Status Kerja -->
            <div class="flex flex-wrap justify-center md:justify-start gap-3 pt-1 text-xs font-mono">
              <span class="bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded text-slate-400">
                📍 Jakarta, Indonesia
              </span>
              <span class="bg-green-950/20 border border-green-800/30 px-2.5 py-1 rounded text-green-400">
                🟢 Available for Projects
              </span>
            </div>
          </div>
        </div>

        <!-- Baris Bawah: Tentang Saya & Fokus -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          <!-- Box: My Mission -->
          <div class="p-4 rounded-lg bg-slate-900/40 border border-slate-800/40 space-y-2">
            <h3 class="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">🚀 Filosofi Kerja</h3>
            <p class="text-slate-300 text-xs leading-relaxed">
              Saya percaya bahwa kode bukan sekadar barisan teks, melainkan instrumen untuk memecahkan masalah nyata. Saya membangun aplikasi dengan prinsip **SOLID**, menjaga efisiensi memori, serta memastikan performa rendering frontend selalu optimal demi kenyamanan pengguna akhir.
            </p>
          </div>

          <!-- Box: Quick Badges -->
          <div class="p-4 rounded-lg bg-slate-900/40 border border-slate-800/40 space-y-3">
            <h3 class="text-sm font-bold text-purple-400 uppercase tracking-wider font-mono">🛠️ Minat Terbesar</h3>
            <div class="flex flex-wrap gap-2">
              <span class="bg-[#1e293b]/50 text-slate-300 px-2.5 py-1 rounded text-xs">Vue.js Ecosystem</span>
              <span class="bg-[#1e293b]/50 text-slate-300 px-2.5 py-1 rounded text-xs">Serverless Architectures</span>
              <span class="bg-[#1e293b]/50 text-slate-300 px-2.5 py-1 rounded text-xs">GraphQL APIs</span>
              <span class="bg-[#1e293b]/50 text-slate-300 px-2.5 py-1 rounded text-xs">CSS Grid & Motion</span>
              <span class="bg-[#1e293b]/50 text-slate-300 px-2.5 py-1 rounded text-xs">Performance Tuning</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
/* Tilt animation untuk neon glowing border */
@keyframes tilt {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(1deg); }
  75% { transform: rotate(-1deg); }
}
.animate-tilt {
  animation: tilt 10s infinite linear;
}
</style>
