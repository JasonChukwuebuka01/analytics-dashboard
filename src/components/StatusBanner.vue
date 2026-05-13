<script setup lang="ts">
import { useDashboardStore } from '@/stores/useDashboardStore'
const store = useDashboardStore()
</script>

<template>
    <div class="w-full border-b transition-colors duration-500 py-1.5 px-4 flex justify-between items-center z-[100]"
        :class="store.isUsingMock
            ? 'bg-amber-500/10 border-amber-500/20'
            : 'bg-emerald-500/10 border-emerald-500/20'">
        <div class="flex items-center gap-3">
            <div class="relative flex items-center justify-center">
                <span class="absolute w-2 h-2 rounded-full opacity-75"
                    :class="store.isUsingMock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-ping'"></span>
                <span class="relative w-2 h-2 rounded-full"
                    :class="store.isUsingMock ? 'bg-amber-500' : 'bg-emerald-500'"></span>
            </div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em]"
                :class="store.isUsingMock ? 'text-amber-500' : 'text-emerald-500'">
                {{ store.isUsingMock ? 'Connection Lost - Using Simulated Data' : 'Uplink Established - BTC/USDT Live'
                }}
            </span>
        </div>
        <div class="hidden md:flex gap-4 font-mono text-[9px] text-slate-500 uppercase">
            <span>IP_ADDR: Verified</span>
            <span>LATENCY: {{ store.isUsingMock ? '0ms' : '142ms' }}</span>
        </div>
    </div>
</template>