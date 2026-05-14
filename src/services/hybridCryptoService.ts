export class HybridCryptoService {
  private socket: WebSocket | null = null
  private mockInterval: ReturnType<typeof setInterval> | null = null
  private price = 67280
  private usingMock = false

  connect(onMessage: (data: any, isMock: boolean) => void) {
    // Clean up any existing instances before reconnecting
    this.disconnect()

    this.socket = new WebSocket('wss://ws.cex.io/ws/')

    this.socket.onopen = () => {
      console.log('--- SYSTEM_UPLINK: CEX.IO ESTABLISHED ---')
      this.stopMock()
      this.usingMock = false
      
      // Correct subscription for specific pair
      this.socket?.send(JSON.stringify({
        e: "subscribe",
        rooms: ["pair-BTC-USD"] // CEX often uses USD for their main web socket
      }))
    }

    this.socket.onmessage = (event) => {
      try {
        const res = JSON.parse(event.data)

        // HEARTBEAT: CEX.IO sends { e: "ping" }, we MUST send { e: "pong" }
        if (res.e === "ping") {
          this.socket?.send(JSON.stringify({ e: "pong" }))
          return
        }

        // PARSING: Look for tick events
        if (res.e === "tick" && res.data) {
           onMessage({
            price: res.data.price,
            change24h: parseFloat(res.data.priceChange || "0")
          }, false) 
        }
      } catch (e) {
        console.error("Stream Parsing Error", e)
      }
    }

    this.socket.onerror = (err) => {
      console.error('Uplink Error:', err)
      this.startMock(onMessage)
    }
    
    this.socket.onclose = () => {
      console.warn('Uplink Terminated: Activating Failover')
      this.startMock(onMessage)
    }
  }

  private startMock(onMessage: (data: any, isMock: boolean) => void) {
    if (this.usingMock) return
    this.usingMock = true

    this.mockInterval = setInterval(() => {
      const rand = Math.random()
      // Simulate industrial volatility
      if (rand > 0.90) this.price += Math.random() * 500
      else if (rand > 0.80) this.price -= Math.random() * 400
      else this.price += (Math.random() - 0.5) * 50

      onMessage({
        price: parseFloat(this.price.toFixed(2)),
        change24h: 1.2,
        volume: Math.floor(Math.random() * 1000)
      }, true)
    }, 1100)
  }

  private stopMock() {
    if (this.mockInterval) clearInterval(this.mockInterval)
    this.mockInterval = null
  }

  disconnect() {
    if (this.socket) {
        this.socket.onclose = null // Prevent triggering mock on intentional close
        this.socket.close()
    }
    this.stopMock()
    this.usingMock = false
  }
}

export const hybridCryptoService = new HybridCryptoService()