import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface MetricPoint {
  timestamp: string
  value: number
}

// 1. Define what a "Log" looks like
export interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'warning' | 'error'
}

export const useDashboardStore = defineStore('dashboard', () => {
  const cpuUsage = ref<MetricPoint[]>([])
  const logs = ref<LogEntry[]>([]) // New state for logs
  const isStreaming = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  const startStream = () => {
    if (isStreaming.value) return
    isStreaming.value = true

    timer = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString()
      const newValue = Math.floor(Math.random() * 100)
      
      const newPoint: MetricPoint = { timestamp, value: newValue }
      cpuUsage.value.push(newPoint)

      if (cpuUsage.value.length > 20) cpuUsage.value.shift()

      // 2. Logic: Create a log based on the value
      generateLog(newValue, timestamp)
    }, 1000)
  }

  // 3. Helper function to create logs
  const generateLog = (value: number, time: string) => {
    let type: 'info' | 'warning' | 'error' = 'info'
    let message = `System check: CPU at ${value}%`

    if (value > 90) {
      type = 'error'
      message = `CRITICAL: CPU usage peaked at ${value}%!`
    } else if (value > 70) {
      type = 'warning'
      message = `Warning: High load detected (${value}%)`
    }

    const newLog: LogEntry = {
      id: crypto.randomUUID(), // Unique ID for Vue's list tracking
      timestamp: time,
      message,
      type
    }

    // Add to the START of the array (newest first)
    logs.value.unshift(newLog)

    // Keep only the last 50 logs for performance
    if (logs.value.length > 50) logs.value.pop()
  }

  const stopStream = () => {
    if (timer) clearInterval(timer)
    isStreaming.value = false
  }

  const latestValue = computed(() => cpuUsage.value.at(-1)?.value ?? 0)

  return { 
    cpuUsage, 
    logs, // Export logs
    isStreaming, 
    startStream, 
    stopStream, 
    latestValue 
  }
})