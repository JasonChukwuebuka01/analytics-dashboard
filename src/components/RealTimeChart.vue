<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Filler,
    Tooltip,
    Legend,
    type TooltipItem
} from 'chart.js'

// REGISTER CHART.JS COMPONENTS
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Filler,
    Tooltip,
    Legend
)

const props = defineProps<{
    chartData: { timestamp: string; value: number }[]
    isDark?: boolean 
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// 2. THEME ADAPTATION ENGINE
const getThemeColors = () => {
    const isDark = document.documentElement.classList.contains('dark')
    return {
        grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)',
        text: isDark ? '#64748b' : '#94a3b8',
        tooltipBg: isDark ? '#0f172a' : '#ffffff',
        tooltipText: isDark ? '#f59e0b' : '#d97706',
    }
}

// INITIALIZE INSTANCE
onMounted(() => {
    if (!canvasRef.value) return

    const colors = getThemeColors()

    chartInstance = new Chart(canvasRef.value, {
        type: 'line',
        data: {
            labels: props.chartData.map(d => d.timestamp),
            datasets: [{
                label: 'BTC/USDT Price',
                data: props.chartData.map(d => d.value),
                borderColor: '#f59e0b', 
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return 'rgba(245, 158, 11, 0.05)';
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
                    gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: '#f59e0b',
                pointHoverBorderColor: '#fff',
                borderWidth: 2,
                borderCapStyle: 'round'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            animation: {
                duration: 400,
                easing: 'easeOutQuart'
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grace: '2%',
                    position: 'right', 
                    grid: {
                        color: colors.grid,
                        drawTicks: false
                    },
                    ticks: {
                        color: colors.text,
                        font: { size: 10, family: 'monospace' },
                        callback: (value) => '$' + Number(value).toLocaleString()
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: colors.text,
                        font: { size: 9 },
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 5
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipText,
                    bodyColor: colors.text,
                    bodyFont: { family: 'monospace' },
                    borderColor: '#f59e0b20',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: (context: TooltipItem<'line'>) => {
                            const val = context.parsed.y;
                            return ` PRICE: $${val?.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    })
})

//  REACTIVE STREAM UPDATES
watch(() => props.chartData, (newData) => {
    if (chartInstance && chartInstance.data.datasets[0]) {
        chartInstance.data.labels = newData.map(d => d.timestamp);
        chartInstance.data.datasets[0].data = newData.map(d => d.value);

        // Logic for smooth scrolling vs hard refresh
        const isRangeSwitch = Math.abs(chartInstance.data.labels.length - newData.length) > 5;
        chartInstance.update(isRangeSwitch ? 'default' : 'none');
    }
}, { deep: true });

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.destroy()
    }
})
</script>

<template>
    <div class="relative h-full w-full p-4 group transition-colors duration-300">
        <!-- Telemetry Labels -->
        <div class="absolute top-4 left-6 z-10 pointer-events-none flex flex-col gap-1">
            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                Market Volatility Index
            </p>
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    BTC/USDT Live
                </span>
            </div>
        </div>
        
        <!-- Canvas Mounting Point -->
        <div class="h-full w-full">
            <canvas ref="canvasRef"></canvas>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/main.css";

canvas {
    filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.05));
}

:deep(.dark) canvas {
    filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
}
</style>