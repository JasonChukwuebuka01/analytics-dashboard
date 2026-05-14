import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hybridCryptoService } from '../services/hybridCryptoService'

// --- TYPED DATA MODELS ---
export interface ChartPoint {
  timestamp: string
  value: number
}

export interface MarketLog {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'warning' | 'error'
}

export type TimeRange = '1m' | '5m' | '1h' | 'LIVE'
export type ThemeMode = 'light' | 'dark'

export const useDashboardStore = defineStore('dashboard', () => {
  // --- STATE ---
  const cpuUsage = ref<ChartPoint[]>([])
  const volumeData = ref<ChartPoint[]>([])
  const logs = ref<MarketLog[]>([])
  const isStreaming = ref(false)
  const isUsingMock = ref(false)
  const userLocation = ref('Detecting...')
  
  // Filtering & Range State
  const searchQuery = ref('')
  const filterLevel = ref<'all' | 'info' | 'warning' | 'error'>('all')
  const selectedRange = ref<TimeRange>('LIVE')

  // Theme State (NEW)
  const theme = ref<ThemeMode>(
    (localStorage.getItem('vortex-theme') as ThemeMode) || 'dark'
  )

  // --- GETTERS ---
  const latestValue = computed(() => cpuUsage.value[cpuUsage.value.length - 1]?.value || 0)

  const filteredChartData = computed(() => {
    const data = cpuUsage.value
    if (selectedRange.value === 'LIVE') return data
    const limit = selectedRange.value === '1m' ? 60 : selectedRange.value === '5m' ? 300 : 3600
    return data.slice(-limit)
  })

  const filteredVolumeData = computed(() => {
    const data = volumeData.value
    if (selectedRange.value === 'LIVE') return data
    const limit = selectedRange.value === '1m' ? 30 : selectedRange.value === '5m' ? 150 : 500
    return data.slice(-limit)
  })

  const filteredLogs = computed(() => {
    return logs.value.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesLevel = filterLevel.value === 'all' || log.type === filterLevel.value
      return matchesSearch && matchesLevel
    })
  })

  // --- ACTIONS ---

  // Theme Actions (NEW)
  const applyTheme = () => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('vortex-theme', theme.value)
    applyTheme()
  }

  const detectLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      userLocation.value = data.city ? `${data.city}, ${data.region_code}` : 'Global Node'
    } catch (e) {
      userLocation.value = 'Global Node'
    }
  }

  const startStream = () => {
    if (isStreaming.value) return
    isStreaming.value = true
    detectLocation()
    applyTheme() 

    hybridCryptoService.connect((data, isMock) => {
      isUsingMock.value = isMock
      const time = new Date().toLocaleTimeString()
      const price = parseFloat(data.price)
      
      const prevPrice = cpuUsage.value[cpuUsage.value.length - 1]?.value || price
      const diff = Math.abs(price - prevPrice)
      const percentChange = (diff / prevPrice) * 100
      
      const baseVolume = Math.floor(Math.random() * 300) + 50
      const volume = percentChange > 0.3 ? baseVolume * 3 : baseVolume

      let type: 'info' | 'warning' | 'error' = 'info'
      let message = ''

      if (percentChange > 0.5) {
        type = 'error'
        message = `🚨 VOLATILITY ALERT: BTC shifted ${percentChange.toFixed(2)}% at $${price.toLocaleString()}`
      } else if (isMock) {
        type = 'warning'
        message = `[SIM] Market ping: $${price.toLocaleString()}`
      } else {
        type = 'info'
        message = `Live trade confirmed: $${price.toLocaleString()}`
      }

      cpuUsage.value.push({ timestamp: time, value: price })
      if (cpuUsage.value.length > 1000) cpuUsage.value.shift() 

      volumeData.value.push({ timestamp: time, value: volume })
      if (volumeData.value.length > 500) volumeData.value.shift()

      logs.value.unshift({ 
        id: crypto.randomUUID(), 
        timestamp: time, 
        message, 
        type 
      })

      if (logs.value.length > 50) logs.value.pop()
    })
  }

  const stopStream = () => {
    hybridCryptoService.disconnect()
    isStreaming.value = false
    cpuUsage.value = []
    volumeData.value = []
    
    logs.value.unshift({
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        message: "SYSTEM_OFFLINE: All uplinks terminated. Buffers cleared.",
        type: 'warning'
    })
  }

  // Initial Theme Run
  applyTheme()

  return { 
    cpuUsage, 
    volumeData,
    logs, 
    isStreaming, 
    isUsingMock, 
    userLocation, 
    latestValue, 
    searchQuery, 
    filterLevel, 
    selectedRange, 
    theme,           
    toggleTheme,     
    filteredChartData, 
    filteredVolumeData, 
    filteredLogs, 
    startStream, 
    stopStream 
  }
})