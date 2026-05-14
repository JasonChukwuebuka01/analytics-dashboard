<script setup lang="ts">
import { useDashboardStore } from '@/stores/useDashboardStore'

const store = useDashboardStore()
</script>

<template>
    <!-- Only show the banner if we are in Mock/Failover mode to keep UI clean -->
    <Transition name="slide-down">
        <div v-if="store.isUsingMock && store.isStreaming" class="sticky top-0 z-[60] w-full border-b transition-all duration-300 backdrop-blur-md
                bg-amber-50/90 border-amber-200 
                dark:bg-amber-950/20 dark:border-amber-500/30">
            <div class="max-w-[1600px] mx-auto px-6 py-2 flex items-center justify-between">

                <div class="flex items-center gap-3">
                    <!-- Warning Icon -->
                    <div
                        class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 shadow-sm shadow-amber-900/20">
                        <span class="text-[10px] font-bold text-white">!</span>
                    </div>

                    <div class="flex flex-col md:flex-row md:items-center md:gap-2">
                        <p class="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                            Connection Failover Active
                        </p>
                        <span class="hidden md:block text-amber-300 dark:text-amber-800">|</span>
                        <p class="text-[10px] font-medium text-amber-600 dark:text-amber-500/80">
                            Primary WebSocket uplink unreachable. Switching to local telemetry simulation.
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1.5">
                        <span class="relative flex h-2 w-2">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span
                            class="text-[9px] font-mono font-bold uppercase tracking-tighter text-amber-600 dark:text-amber-500">
                            Retrying Uplink...
                        </span>
                    </div>
                </div>

            </div>
        </div>
    </Transition>
</template>

<style scoped>

@reference "@/assets/main.css";

.slide-down-enter-active,
.slide-down-leave-active {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

/* Ensure content below doesn't jitter when banner appears */
:deep(.slide-down-enter-to) {
    transform: translateY(0);
}
</style>