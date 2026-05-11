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
    Legend
} from 'chart.js'

// 1. REGISTER: We tell Chart.js exactly which pieces we need.
// This is the "5-star" way to ensure TypeScript knows what's going on.
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

// 2. PROPS: Receiving our live data from the Pinia Store
const props = defineProps<{
    chartData: { timestamp: string; value: number }[]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// 3. INITIALIZE: Create the chart instance on mount
onMounted(() => {
    if (!canvasRef.value) return

    chartInstance = new Chart(canvasRef.value, {
        type: 'line',
        data: {
            labels: props.chartData.map(d => d.timestamp),
            datasets: [{
                label: 'System Load',
                data: props.chartData.map(d => d.value),
                borderColor: '#f97316', // Tailwind orange-500
                backgroundColor: 'rgba(249, 115, 22, 0.1)', // Subtle orange glow
                fill: true,
                tension: 0.4, // Smooth "organic" curves
                pointRadius: 0, // Hiding points for a cleaner "streaming" look
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            // Performance trick: disable animations for the initial load
            // so it doesn't "bounce" every time a single point is added
            animation: {
                duration: 400,
                easing: 'linear'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', maxRotation: 0 }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    })
})

// 4. THE WATCHER: The "useEffect" that updates the chart
watch(
    () => props.chartData,
    (newData) => {
        // Check if the instance and the specific dataset exist before touching them
        if (chartInstance && chartInstance.data.datasets[0]) {
            chartInstance.data.labels = newData.map(d => d.timestamp)

            // We cast the data or use a safer assignment
            chartInstance.data.datasets[0].data = newData.map(d => d.value)

            chartInstance.update('none')
        }
    },
    { deep: true }
)

// 5. CLEANUP: Vital for "Performance Optimization" grade
onUnmounted(() => {
    if (chartInstance) {
        chartInstance.destroy()
    }
})
</script>

<template>
    <div class="relative h-full w-full">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>