<script setup>
defineProps({
  show: { type: Boolean, default: false },
  src: { type: String, required: true }
})
defineEmits(['close'])
</script>

<template>
  <transition name="fade-editor">
    <div 
      v-if="show" 
      class="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
      @click="$emit('close')"
    >
      <img 
        :src="src" 
        alt="Zoomed Preview" 
        class="max-w-full max-h-[80vh] rounded-2xl shadow-2xl shadow-cyan-500/20"
        @click.stop
      />
    </div>
  </transition>
</template>
