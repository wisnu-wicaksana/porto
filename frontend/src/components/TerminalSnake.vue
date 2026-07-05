<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const GRID_SIZE = 20
const CELL_SIZE = 15 // not strictly needed for grid logic, but just conceptually 20x20 cells

const snake = ref([{ x: 10, y: 10 }])
const food = ref({ x: 5, y: 5 })
const direction = ref({ x: 1, y: 0 })
const nextDirection = ref({ x: 1, y: 0 })
const isGameOver = ref(false)
const score = ref(0)
const isPlaying = ref(false)
let gameInterval = null

const startGame = () => {
  snake.value = [{ x: 10, y: 10 }]
  direction.value = { x: 1, y: 0 }
  nextDirection.value = { x: 1, y: 0 }
  score.value = 0
  isGameOver.value = false
  isPlaying.value = true
  spawnFood()
  
  if (gameInterval) clearInterval(gameInterval)
  gameInterval = setInterval(gameLoop, 150)
  
  // Prevent default scrolling when playing
  window.addEventListener('keydown', handleKeydown, { passive: false })
}

const stopGame = () => {
  isPlaying.value = false
  if (gameInterval) clearInterval(gameInterval)
  window.removeEventListener('keydown', handleKeydown)
}

const spawnFood = () => {
  let newFood
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    // Make sure food doesn't spawn on snake
    const isOnSnake = snake.value.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    if (!isOnSnake) break
  }
  food.value = newFood
}

const gameLoop = () => {
  if (!isPlaying.value || isGameOver.value) return
  
  direction.value = { ...nextDirection.value }
  
  const head = { ...snake.value[0] }
  head.x += direction.value.x
  head.y += direction.value.y
  
  // Check wall collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    gameOver()
    return
  }
  
  // Check self collision
  if (snake.value.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver()
    return
  }
  
  snake.value.unshift(head)
  
  // Check food collision
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    spawnFood()
  } else {
    snake.value.pop()
  }
}

const gameOver = () => {
  isGameOver.value = true
  isPlaying.value = false
  if (gameInterval) clearInterval(gameInterval)
}

const handleKeydown = (e) => {
  if (!isPlaying.value) return
  
  // Prevent scrolling for arrow keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault()
  }
  
  setDirection(e.key)
}

const setDirection = (key) => {
  switch (key) {
    case 'ArrowUp':
    case 'w':
      if (direction.value.y !== 1) nextDirection.value = { x: 0, y: -1 }
      break
    case 'ArrowDown':
    case 's':
      if (direction.value.y !== -1) nextDirection.value = { x: 0, y: 1 }
      break
    case 'ArrowLeft':
    case 'a':
      if (direction.value.x !== 1) nextDirection.value = { x: -1, y: 0 }
      break
    case 'ArrowRight':
    case 'd':
      if (direction.value.x !== -1) nextDirection.value = { x: 1, y: 0 }
      break
  }
}

onMounted(() => {
  // Optional: Auto start or wait for user to click start
})

onUnmounted(() => {
  stopGame()
})

</script>

<template>
  <div class="my-4 p-4 border border-emerald-900/50 bg-black/50 rounded-lg inline-block w-full max-w-[350px]">
    <div class="flex justify-between items-center mb-4 border-b border-emerald-900/50 pb-2">
      <div class="text-emerald-400 font-bold flex items-center space-x-2">
        <span>🐍</span>
        <span>SNAKE.EXE</span>
      </div>
      <div class="text-emerald-300">SCORE: {{ score.toString().padStart(4, '0') }}</div>
    </div>
    
    <div class="relative bg-[#020617] border border-emerald-900/50 outline-none select-none touch-none"
         style="aspect-ratio: 1/1; width: 100%;">
      
      <!-- Grid Cells -->
      <div v-for="y in GRID_SIZE" :key="'row-'+y" class="flex" style="height: 5%;">
        <div v-for="x in GRID_SIZE" :key="'col-'+x" 
             class="w-[5%] h-full flex items-center justify-center text-[10px]"
             :class="{
               'bg-emerald-500/20 border border-emerald-500/10': snake.some(s => s.x === x-1 && s.y === y-1),
               'bg-emerald-400': snake[0].x === x-1 && snake[0].y === y-1,
               'text-red-500': food.x === x-1 && food.y === y-1
             }">
             <span v-if="food.x === x-1 && food.y === y-1">🍎</span>
        </div>
      </div>
      
      <!-- Overlays -->
      <div v-if="!isPlaying && !isGameOver" class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
        <button @click="startGame" class="px-4 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/50 rounded shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all font-bold">
          [ START GAME ]
        </button>
        <p class="mt-4 text-xs text-emerald-600">Use WASD or Arrows to move</p>
      </div>
      
      <div v-if="isGameOver" class="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center backdrop-blur-sm border-2 border-red-500/50">
        <div class="text-red-400 font-bold text-xl mb-2 animate-pulse">GAME OVER</div>
        <div class="text-emerald-300 mb-6">FINAL SCORE: {{ score }}</div>
        <button @click="startGame" class="px-4 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/50 rounded shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
          [ TRY AGAIN ]
        </button>
      </div>
    </div>
    
    <div class="mt-4 text-[10px] text-emerald-700 text-center hidden md:block">
      Click inside the box to play. Press Esc to exit.
    </div>

    <!-- Mobile D-pad Controls -->
    <div v-if="isPlaying" class="mt-4 grid grid-cols-3 gap-2 w-32 mx-auto md:hidden">
      <div class="col-start-2">
        <button @click="setDirection('w')" class="w-10 h-10 bg-emerald-900/50 hover:bg-emerald-800 rounded flex items-center justify-center text-emerald-300 border border-emerald-700 active:bg-emerald-700">▲</button>
      </div>
      <div class="col-start-1 row-start-2">
        <button @click="setDirection('a')" class="w-10 h-10 bg-emerald-900/50 hover:bg-emerald-800 rounded flex items-center justify-center text-emerald-300 border border-emerald-700 active:bg-emerald-700">◀</button>
      </div>
      <div class="col-start-2 row-start-2">
        <button @click="setDirection('s')" class="w-10 h-10 bg-emerald-900/50 hover:bg-emerald-800 rounded flex items-center justify-center text-emerald-300 border border-emerald-700 active:bg-emerald-700">▼</button>
      </div>
      <div class="col-start-3 row-start-2">
        <button @click="setDirection('d')" class="w-10 h-10 bg-emerald-900/50 hover:bg-emerald-800 rounded flex items-center justify-center text-emerald-300 border border-emerald-700 active:bg-emerald-700">▶</button>
      </div>
    </div>
  </div>
</template>
