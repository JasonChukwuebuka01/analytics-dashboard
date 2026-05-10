import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// This is our Data Model (TypeScript)
export interface MetricPoint {
  timestamp: string
  value: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  // 1. STATE (The raw data)
  const cpuUsage = ref<MetricPoint[] >([])
  const isStreaming = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null




  // 2. ACTIONS (Functions that change the data)
  const startStream = () => {
    if (isStreaming.value) return
    isStreaming.value = true

    timer = setInterval(() => {
      const newPoint: MetricPoint = {
        timestamp: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 100) // Simulating 0-100% CPU
      }

      // Add to our list
      cpuUsage.value.push(newPoint)

      // Performance Optimization: Keep only the last 20 points
      if (cpuUsage.value.length > 20) {
        cpuUsage.value.shift()
      }
    }, 1000)
  };



  const stopStream = () => {
    if (timer) clearInterval(timer)
    isStreaming.value = false
  };

  // 3. GETTERS (Like 'useMemo' in React - computed values)
 const latestValue = computed(() => {
  return cpuUsage.value.at(-1)?.value ?? 0
})
  return { 
    cpuUsage, 
    isStreaming, 
    startStream, 
    stopStream, 
    latestValue 
  }
})