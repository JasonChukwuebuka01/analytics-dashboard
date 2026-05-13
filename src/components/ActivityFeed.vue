<script setup lang="ts">
import { useDashboardStore } from '@/stores/useDashboardStore'

// Connect to the store (The Brain)
const store = useDashboardStore()
</script>

<template>
  <section
    class="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full max-h-[700px] overflow-hidden shadow-2xl">

    <!-- HEADER -->
    <header class="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 space-y-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <h3 class="font-bold text-slate-200 text-sm uppercase tracking-widest">Market Activity</h3>
          <!-- MOCK/LIVE STATUS BADGE -->
          <span
            :class="store.isUsingMock ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'"
            class="text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-tighter">
            {{ store.isUsingMock ? 'Simulated' : 'Live Feed' }}
          </span>
        </div>

        <span class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full animate-pulse"
            :class="store.isUsingMock ? 'bg-rose-500' : 'bg-emerald-500'"></span>
          <span class="text-[10px] font-mono text-slate-500 uppercase">
            {{ store.isUsingMock ? 'WebSocket Failover' : 'WebSocket Active' }}
          </span>
        </span>
      </div>

      <!-- SEARCH & FILTER BAR -->
      <div class="flex flex-col gap-3">
        <div class="relative">
          <input v-model="store.searchQuery" type="text" placeholder="Search price or movement..."
            class="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-600" />
          <span class="absolute left-3 top-2.5 text-slate-600 text-[10px]">🔍</span>
        </div>

        <!-- Filter Pills -->
        <div class="flex gap-2">
          <button v-for="level in (['all', 'info', 'warning', 'error'] as const)" :key="level"
            @click="store.filterLevel = level"
            class="capitalize text-[10px] font-bold px-3 py-1 rounded-md border transition-all duration-200" :class="store.filterLevel === level
              ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-900/30'
              : 'border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'">
            <!-- Label transformation for better UX -->
            {{ level === 'error' ? 'Alerts' : level === 'warning' ? 'Simulated' : level === 'info' ? 'Live' : 'All' }}
          </button>
        </div>
      </div>
    </header>

    <!-- LOG LIST -->
    <ul class="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth custom-scrollbar bg-slate-900/30">
      <TransitionGroup name="list">
        <li v-for="log in store.filteredLogs" :key="log.id"
          class="group flex items-start gap-3 p-3 rounded-xl border bg-slate-950/40 hover:bg-slate-950/80 transition-all duration-300"
          :class="[
            log.type === 'error' ? 'border-rose-500/20 bg-rose-500/5' :
              log.type === 'warning' ? 'border-amber-500/20 bg-amber-500/5' :
                'border-slate-800'
          ]">
          <!-- Asset Ticker Badge -->
          <div class="mt-1 flex flex-col items-center">
            <span
              class="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-orange-400 transition-colors">BTC</span>
            <span class="w-0.5 h-4 bg-slate-800 mt-1"></span>
          </div>

          <article class="flex-1 min-w-0">
            <div class="flex justify-between items-start gap-2">
              <p class="text-sm text-slate-300 leading-tight font-medium">
                {{ log.message }}
              </p>
              <span v-if="log.type === 'error'"
                class="text-[10px] text-rose-500 animate-pulse font-bold whitespace-nowrap">VOLATILITY ALERT</span>
            </div>

            <div class="flex items-center gap-2 mt-1.5">
              <time :datetime="log.timestamp" class="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
                {{ log.timestamp }}
              </time>
              <span class="text-slate-800">•</span>
              <span class="text-[9px] text-slate-600 uppercase font-bold tracking-widest">
                {{ store.isUsingMock ? 'SIM_UPLINK' : 'LIVE_NODE' }}
              </span>
            </div>
          </article>
        </li>
      </TransitionGroup>

      <!-- EMPTY STATE -->
      <li v-if="store.filteredLogs.length === 0" class="text-center py-20">
        <div class="bg-slate-800/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-xl">👻</span>
        </div>
        <p class="text-slate-600 italic text-sm">No events match your criteria</p>
        <button @click="store.searchQuery = ''; store.filterLevel = 'all'"
          class="mt-4 text-[10px] text-orange-500 hover:text-orange-400 uppercase font-bold tracking-widest transition-colors">
          Reset Filters
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* List Animation */
.list-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

/* Slim Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
</style>