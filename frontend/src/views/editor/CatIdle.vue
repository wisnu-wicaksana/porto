<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentFrame = ref(0)
let intervalId = null

const frames = [
`
           
           
  |\\__/,|   (\`\\
  |_ _  |.--.) )
  ( T   )     /
 (((^_(((/(((_/
`,
`
  z        
           
  |\\__/,|   (\`\\
  |_ _  |.--.) )
  ( T   )     /
 (((^_(((/(((_/
`,
`
      z    
  z        
  |\\__/,|   (\`\\
  |_ _  |.--.) )
  ( T   )     /
 (((^_(((/(((_/
`,
`
          Z
      z    
  |\\__/,|   (\`\\
  |_ _  |.--.) )
  ( T   )     /
 (((^_(((/(((_/
`,
`
           
          Z
  |\\__/,|   (\`\\
  |_ _  |.--.) )
  ( T   )     /
 (((^_(((/(((_/
`
]

onMounted(() => {
  intervalId = setInterval(() => {
    currentFrame.value = (currentFrame.value + 1) % frames.length
  }, 400) // Animasi lebih lambat karena sedang tidur (400ms)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 font-mono select-none">
    <div class="mb-4 text-center">
      <pre class="text-lg md:text-xl font-bold leading-none text-left inline-block" style="text-shadow: 0 0 10px rgba(148, 163, 184, 0.5);">{{ frames[currentFrame] }}</pre>
    </div>
    <div class="mt-6 text-center text-slate-500 text-xs flex items-center justify-center space-x-2">
      <span class="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
      <span>System sleeping. Waiting for activity...</span>
    </div>
  </div>
</template>
