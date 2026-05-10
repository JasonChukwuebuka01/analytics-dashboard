<script setup lang="ts">
import { useDashboardStore } from './stores/useDashboardStore'

// Initialize the store
const store = useDashboardStore()
</script>

<template>
  <main class="min-h-screen bg-slate-950 text-white p-8">
    <div class="max-w-4xl mx-auto">
      
      <header class="flex justify-between items-center mb-12">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-orange-500">Live Analytics</h1>
          <p class="text-slate-400">Real-time system monitoring engine</p>
        </div>
        
        <div class="space-x-4">
          <button 
            @click="store.startStream"
            :disabled="store.isStreaming"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
          >
            Start Stream
          </button>
          <button 
            @click="store.stopStream"
            :disabled="!store.isStreaming"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-lg font-semibold transition-all"
          >
            Stop
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 class="text-slate-400 text-sm font-medium uppercase tracking-wider">CPU Usage</h3>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-6xl font-bold tabular-nums">
              {{ store.latestValue }}%
            </span>
            <div 
              class="w-3 h-3 rounded-full animate-pulse"
              :class="store.isStreaming ? 'bg-emerald-500' : 'bg-slate-700'"
            ></div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>