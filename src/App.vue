<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from './stores/useDashboardStore'
import RealTimeChart from './components/RealTimeChart.vue'
import ActivityFeed from './components/ActivityFeed.vue'

const store = useDashboardStore()

// Auto-start the "proper" system on mount
onMounted(() => {
  store.startStream()
})
</script>

<template>
  <div class="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-orange-500/30">
    <!-- 1. Top Navigation Bar -->
    <nav class="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
            <span class="font-black text-white text-xs">V</span>
          </div>
          <h1 class="font-bold tracking-tight text-lg uppercase italic">Vortex<span
              class="text-orange-500 font-black">.OS</span></h1>
        </div>

        <div class="flex items-center gap-6">
          <div class="hidden md:flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-xs font-mono text-emerald-500 uppercase tracking-widest">System Online</span>
          </div>
          <button @click="store.isStreaming ? store.stopStream() : store.startStream()"
            class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-tighter transition-all border" :class="store.isStreaming
              ? 'border-rose-500/50 text-rose-500 hover:bg-rose-500/10'
              : 'border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10'">
            {{ store.isStreaming ? 'Pause Stream' : 'Resume Stream' }}
          </button>
        </div>
      </div>
    </nav>

    <!-- 2. Main Dashboard Layout -->
    <main class="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">

      <!-- LEFT COLUMN: Metrics & Chart (8 Cols) -->
      <div class="col-span-12 lg:col-span-8 space-y-6">

        <!-- Metric Cards Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl">
            <p class="text-xs font-semibold text-slate-500 uppercase">CPU Load</p>
            <div class="flex items-end justify-between mt-1">
              <h2 class="text-4xl font-black tabular-nums">{{ store.latestValue }}%</h2>
              <span class="text-emerald-500 text-xs font-bold">Live</span>
            </div>
          </div>
          <!-- We can add more metrics here later (Memory, Network) -->
        </div>

        <!-- Main Chart Container -->
        <div class="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl h-[500px] flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-slate-400 uppercase text-xs tracking-widest">Telemetry Timeline</h3>
            <div class="flex gap-2">
              <span class="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold">1m</span>
              <span class="px-2 py-1 rounded text-[10px] font-bold text-slate-600">5m</span>
            </div>
          </div>
          <div class="flex-1">
            <RealTimeChart :chart-data="store.cpuUsage" />
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Activity Feed (4 Cols) -->
      <div class="col-span-12 lg:col-span-4 h-[700px] lg:h-auto">
        <ActivityFeed />
      </div>

    </main>
  </div>
</template>