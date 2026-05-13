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

// 1. REGISTER
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
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// 3. INITIALIZE
onMounted(() => {
    if (!canvasRef.value) return

    chartInstance = new Chart(canvasRef.value, {
        type: 'line',
        data: {
            labels: props.chartData.map(d => d.timestamp),
            datasets: [{
                label: 'BTC/USDT Price',
                data: props.chartData.map(d => d.value),
                borderColor: '#f59e0b', // Amber-500
                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2.5,
                borderCapStyle: 'round'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grace: '5%',
                    grid: {
                        color: 'rgba(255, 255, 255, 0.03)',
                        drawTicks: false
                    },
                    ticks: {
                        color: '#475569',
                        font: { size: 10, family: 'monospace' },
                        callback: (value) => '$' + Number(value).toLocaleString()
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#475569',
                        font: { size: 9 },
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#0f172a',
                    titleColor: '#f59e0b',
                    bodyFont: { family: 'monospace' },
                    callbacks: {
                        // FIX: Added optional chaining and type safety to prevent null errors
                        label: (context: TooltipItem<'line'>) => {
                            const val = context.parsed.y;
                            return ` Price: $${val !== null && val !== undefined ? val.toLocaleString() : '---'}`;
                        }
                    }
                }
            }
        }
    })
})

watch(() => props.chartData, (newData) => {
    
    if (chartInstance && chartInstance.data.datasets[0]) {
        chartInstance.data.labels = newData.map(d => d.timestamp);
        chartInstance.data.datasets[0].data = newData.map(d => d.value);

        // If the data length just changed significantly (user clicked a button)
        // let it animate so the user sees the 'snap'
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
    <div class="relative h-full w-full p-2">
        <div class="absolute top-4 left-4 z-10 pointer-events-none">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Volatility Index</p>
        </div>
        <canvas ref="canvasRef"></canvas>
    </div>
</template>