<script setup lang="ts">
import { useDashboardStore } from '@/stores/useDashboardStore'

const store = useDashboardStore()
</script>

<template>
  <!-- SECTION: The primary container for this dashboard module -->
  <section class="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full max-h-[700px] overflow-hidden">

    <!-- HEADER: Contains title and status -->
    <header
      class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
      <h3 class="font-bold text-slate-200 text-sm uppercase tracking-widest">System Activity</h3>
      <span class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span class="text-[10px] font-mono text-slate-500 uppercase">Live</span>
      </span>
    </header>

    <!-- UL: The semantic list of log events with internal scrolling -->
    <ul class="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth custom-scrollbar">
      <TransitionGroup name="list">
        <li v-for="log in store.logs" :key="log.id"
          class="flex items-start gap-3 p-3 rounded-xl border bg-slate-950/40 transition-all duration-300" :class="[
            log.type === 'error' ? 'border-rose-500/30' :
              log.type === 'warning' ? 'border-amber-500/30' :
                'border-slate-800'
          ]">
          <!-- Semantic indicator for severity -->
          <span class="mt-1.5 w-2 h-2 rounded-full shrink-0" :class="[
            log.type === 'error' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
              log.type === 'warning' ? 'bg-amber-500' :
                'bg-emerald-500'
          ]" aria-hidden="true"></span>

          <article class="flex-1 min-w-0">
            <p class="text-sm text-slate-300 leading-relaxed font-medium">
              {{ log.message }}
            </p>
            <!-- TIME: Semantic element for dates/times -->
            <time :datetime="log.timestamp"
              class="text-[10px] font-mono text-slate-500 mt-1 block uppercase tracking-tighter">
              {{ log.timestamp }}
            </time>
          </article>
        </li>
      </TransitionGroup>

      <!-- Empty State -->
      <li v-if="store.logs.length === 0" class="text-center py-20 text-slate-600 italic text-sm">
        Initializing secure data tunnel...
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* Transition Group Animations */
.list-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Custom Slim Scrollbar for high-end UI */
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

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>