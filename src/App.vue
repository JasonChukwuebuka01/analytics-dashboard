<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from './stores/useDashboardStore'
import RealTimeChart from './components/RealTimeChart.vue'
import VolumeBarChart from './components/VolumeBarChart.vue'
import ActivityFeed from './components/ActivityFeed.vue'
import StatusBanner from './components/StatusBanner.vue'

const store = useDashboardStore()

onMounted(() => {
  store.startStream()
})
</script>

<template>
  <!-- Main Container: Adaptive background and text colors -->
  <div class="min-h-screen flex flex-col font-sans transition-colors duration-300
              bg-white text-slate-900 
              dark:bg-[#020617] dark:text-slate-200">
    
    <!-- Resilience & Connection Banner -->
    <StatusBanner />
   

    <!-- NAVIGATION -->
    <nav class="sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300
                border-slate-200 bg-white/50 
                dark:border-slate-800 dark:bg-slate-950/50">
      <div class="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
            <span class="font-black text-white text-xs">V</span>
          </div>
          <h1 class="font-bold tracking-tight text-lg uppercase italic 
                     text-slate-900 dark:text-slate-100">
            Vortex<span class="text-orange-500 font-black">.OS</span>
          </h1>
        </div>

        <div class="flex items-center gap-4">
          <!-- THEME TOGGLE -->
          <button 
            @click="store.toggleTheme()"
            class="p-2 rounded-lg border transition-all cursor-pointer
                   border-slate-200 bg-slate-50 hover:bg-slate-100
                   dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            :title="store.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <span v-if="store.theme === 'dark'" class="text-amber-400 text-sm">☀️</span>
            <span v-else class="text-indigo-600 text-sm">🌙</span>
          </button>

          <!-- STREAM ENGINE CONTROL -->
          <button 
            @click="store.isStreaming ? store.stopStream() : store.startStream()"
            class="px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border cursor-pointer"
            :class="store.isStreaming 
              ? 'border-rose-500/40 text-rose-600 dark:text-rose-500 hover:bg-rose-500/10' 
              : 'border-emerald-500/40 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10'"
          >
            {{ store.isStreaming ? 'Terminate Engine' : 'Initialize Engine' }}
          </button>
        </div>
      </div>
    </nav>

    <!-- DASHBOARD MAIN GRID -->
    <main class="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6 w-full flex-1">
      
      <!-- ANALYTICS COLUMN (Span 8) -->
      <div class="col-span-12 lg:col-span-8 space-y-6">
        
        <!-- TELEMETRY CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-5 border rounded-2xl transition-all hover:border-orange-500/50
                      bg-slate-50 border-slate-200
                      dark:bg-slate-900/40 dark:border-slate-800">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Asset: BTC/USDT</p>
            <h2 class="text-3xl font-black mt-2 tabular-nums text-slate-900 dark:text-white">
              ${{ store.latestValue.toLocaleString() }}
            </h2>
          </div>

          <div class="p-5 border rounded-2xl transition-all hover:border-orange-500/50
                      bg-slate-50 border-slate-200
                      dark:bg-slate-900/40 dark:border-slate-800">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Local Node</p>
            <h2 class="text-2xl font-black mt-2 text-slate-700 dark:text-slate-300 truncate uppercase tracking-tight">
              {{ store.userLocation }}
            </h2>
          </div>

          <div class="p-5 border rounded-2xl transition-all hover:border-orange-500/50
                      bg-slate-50 border-slate-200
                      dark:bg-slate-900/40 dark:border-slate-800">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Uplink Status</p>
            <div class="flex items-center gap-2 mt-3">
              <div class="w-2 h-2 rounded-full animate-pulse" 
                   :class="store.isUsingMock ? 'bg-amber-500' : 'bg-emerald-500'"></div>
              <span class="text-xs font-bold uppercase tracking-widest" 
                    :class="store.isUsingMock ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500'">
                {{ store.isUsingMock ? 'Failover: Simulated' : 'Socket: Live' }}
              </span>
            </div>
          </div>
        </div>

        <!-- PRIMARY PRICE CHART -->
        <div class="p-6 border rounded-2xl h-[450px] flex flex-col relative group transition-all
                    bg-slate-50 border-slate-200 hover:border-slate-300
                    dark:bg-slate-900/40 dark:border-slate-800 dark:hover:border-slate-700">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <span class="w-1 h-3 bg-orange-500 rounded-full"></span>
              <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Price History</p>
            </div>
            
            <!-- TIME RANGE SELECTOR -->
            <div class="flex gap-1 p-1 rounded-lg border shadow-inner
                        bg-slate-100 border-slate-200
                        dark:bg-slate-950 dark:border-slate-800">
              <button 
                v-for="range in (['1m', '5m', '1h', 'LIVE'] as const)" 
                :key="range"
                @click="store.selectedRange = range"
                class="px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all cursor-pointer"
                :class="store.selectedRange === range 
                  ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-slate-700 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-600 hover:text-slate-900 dark:hover:text-slate-400'"
              >
                {{ range }}
              </button>
            </div>
          </div>
          
          <div class="flex-1 min-h-0">
            <RealTimeChart :chart-data="store.filteredChartData" />
          </div>
        </div>

        <!-- VOLUME ANALYTICS -->
        <div class="p-6 border rounded-2xl transition-all
                    bg-slate-50 border-slate-200 hover:border-slate-300
                    dark:bg-slate-900/40 dark:border-slate-800 dark:hover:border-slate-700">
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-2">
              <span class="w-1 h-3 bg-slate-400 dark:bg-slate-600 rounded-full"></span>
              <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Transaction Volume</p>
            </div>
            <div class="text-right">
              <p class="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase">Current Load</p>
              <p class="text-xs font-mono font-bold text-orange-600 dark:text-orange-500">
                {{ store.volumeData[store.volumeData.length - 1]?.value || 0 }} UNITS
              </p>
            </div>
          </div>
          <div class="h-24">
            <VolumeBarChart :volume-data="store.filteredVolumeData" />
          </div>
        </div>
      </div>

      <!-- ACTIVITY FEED COLUMN -->
      <div class="col-span-12 lg:col-span-4">
        <ActivityFeed />
      </div>

    </main>

    <!-- SYSTEM FOOTER -->
    <footer class="max-w-[1600px] mx-auto w-full px-6 py-4 border-t flex justify-between items-center text-[9px] font-mono uppercase tracking-widest
                    border-slate-200 text-slate-400
                    dark:border-slate-800 dark:text-slate-600">
      <div class="flex gap-4">
        <span>MEM_FOOTPRINT: {{ (Math.random() * 5 + 40).toFixed(1) }}MB</span>
        <span>LATENCY: 14MS</span>
        <span :class="store.isStreaming ? 'text-emerald-600 dark:text-emerald-900' : 'text-rose-600 dark:text-rose-900'">
          ENGINE_STATUS: {{ store.isStreaming ? 'ACTIVE' : 'IDLE' }}
        </span>
      </div>
      <div class="hidden md:block">
        Vortex.OS Terminal // Node: {{ store.userLocation.split(',')[0] }}
      </div>
    </footer>
  </div>
</template>

<style>

@reference "@/assets/main.css";


@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Custom Scrollbar using @apply */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  @apply bg-slate-50 dark:bg-[#020617];
}
::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-800 rounded-full;
}
::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400 dark:bg-slate-700;
}
</style>