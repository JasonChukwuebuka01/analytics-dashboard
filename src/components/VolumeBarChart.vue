<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import {
    Chart,
    BarController,
    BarElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    type ChartConfiguration
} from 'chart.js'

// 1. REGISTER COMPONENTS
Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip)

const props = defineProps<{
    volumeData: { timestamp: string; value: number }[]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Utility to get dynamic colors based on theme
const getBarColors = () => {
    const isDark = document.documentElement.classList.contains('dark')
    return {
        base: isDark ? '#334155' : '#cbd5e1', 
        hover: '#f59e0b', // Amber-500
        tooltipBg: isDark ? '#0f172a' : '#ffffff',
        tooltipBorder: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)'
    }
}

// 2. INITIALIZE CHART
onMounted(() => {
    if (!canvasRef.value) return

    const colors = getBarColors()

    const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
            labels: props.volumeData.map(d => d.timestamp),
            datasets: [{
                label: 'Volume',
                data: props.volumeData.map(d => d.value),
                backgroundColor: colors.base,
                hoverBackgroundColor: colors.hover,
                borderRadius: 4,
                borderSkipped: false,
                maxBarThickness: 12, 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0 // Performance-first for telemetry
            },
            scales: {
                y: {
                    display: false,
                    grid: { display: false }
                },
                x: {
                    display: false,
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    borderColor: colors.tooltipBorder,
                    borderWidth: 1,
                    titleColor: '#64748b',
                    bodyColor: colors.hover,
                    titleFont: { family: 'monospace', size: 10 },
                    bodyFont: { family: 'monospace', weight: 'bold', size: 11 },
                    padding: 8,
                    cornerRadius: 6,
                    displayColors: false,
                    callbacks: {
                        label: (ctx) => ` VOL: ${ctx.parsed.y?.toLocaleString() ?? 0} units`
                    }
                }
            }
        }
    }

    chartInstance = new Chart(canvasRef.value, config)
})

// 3. REACTIVE UPDATES
watch(
    () => props.volumeData,
    (newData) => {
        if (chartInstance?.data?.datasets?.[0]) {
            const colors = getBarColors()

            chartInstance.data.labels = newData.map(d => d.timestamp)
            chartInstance.data.datasets[0].data = newData.map(d => d.value)
            chartInstance.data.datasets[0].backgroundColor = colors.base 

            chartInstance.update('none')
        }
    },
    { deep: true }
)

// 4. CLEANUP
onUnmounted(() => {
    if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
    }
})
</script>

<template>
    <div class="h-full w-full relative group p-2">
        <!-- Mini Metric Overlay -->
        <div
            class="absolute bottom-2 right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span class="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
                Telemetry Stream: 120Hz
            </span>
        </div>

        <canvas ref="canvasRef" class="w-full h-full"></canvas>
    </div>
</template>

<style scoped>
@reference "@/assets/main.css";

canvas {
    max-width: 100% !important;
    max-height: 100% !important;
    transition: filter 0.3s ease;
}

/* Subtle glow effect for bars in dark mode */
:deep(.dark) canvas {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
}
</style>