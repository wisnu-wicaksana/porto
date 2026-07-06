<script setup>
</script>

<template>
  <footer class="hidden lg:flex h-6 bg-slate-950 border-t border-slate-800/80 justify-between items-center px-3 text-[11px] font-mono text-slate-500 shrink-0 select-none z-20">
    <div class="flex items-center space-x-4">
      <!-- Git Branch -->
      <span class="flex items-center space-x-1 text-cyan-500">
        <span class="font-bold ml-1">main*</span>
      </span>
      <!-- GitHub API Status Indicator -->
      <span class="flex items-center space-x-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>GitHub GraphQL Sync</span>
      </span>
    </div>
    
    <div class="flex items-center space-x-4">
      <span>Ln 1, Col 1</span>
      <span>Spaces: 2</span>
      <span class="hidden sm:inline">UTF-8</span>
      <span class="text-purple-400 font-bold hidden sm:inline">Vercel Serverless v20</span>
    </div>
  </footer>
</template>
