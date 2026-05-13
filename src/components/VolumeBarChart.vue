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

// 2. INITIALIZE CHART
onMounted(() => {
  if (!canvasRef.value) return

  const config: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: props.volumeData.map(d => d.timestamp),
      datasets: [{
        label: 'Volume',
        data: props.volumeData.map(d => d.value),
        backgroundColor: '#334155', // Slate-700
        hoverBackgroundColor: '#f59e0b', // Amber-500
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0 // Performance optimization for real-time streams
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
          backgroundColor: '#0f172a',
          titleFont: { family: 'monospace' },
          bodyFont: { family: 'monospace' },
          callbacks: { 
            // Fixed potential null access in tooltip
            label: (ctx) => ` Vol: ${ctx.parsed.y?.toLocaleString() ?? 0} units` 
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
    // Logic Gate: Check if instance exists AND if the dataset is initialized
    if (chartInstance?.data?.datasets?.[0]) {
      chartInstance.data.labels = newData.map(d => d.timestamp)
      chartInstance.data.datasets[0].data = newData.map(d => d.value)
      
      // 'none' prevents animation frames from stacking and killing performance
      chartInstance.update('none')
    }
  }, 
  { deep: true }
)

// 4. CLEANUP (Prevent Memory Leaks)
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<template>
  <div class="h-full w-full relative">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
/* Ensure the canvas doesn't overflow its bento-grid container */
canvas {
  max-width: 100% !important;
  max-height: 100% !important;
}
</style>