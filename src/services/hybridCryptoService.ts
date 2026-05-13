export class HybridCryptoService {
  private socket: WebSocket | null = null
  private mockInterval: ReturnType<typeof setInterval> | null = null
  private price = 67280
  private usingMock = false

  connect(onMessage: (data: any, isMock: boolean) => void) {
    // Attempt real connection
    this.socket = new WebSocket('wss://ws.cex.io/ws/')

    this.socket.onopen = () => {
      this.stopMock()
      this.usingMock = false
      this.socket?.send(JSON.stringify({ e: "subscribe", rooms: ["tickers"] }))
    }

    this.socket.onmessage = (event) => {
      try {
        const res = JSON.parse(event.data)
        if (res.e === "tick" && res.data?.symbol === "BTC:USDT") {
          onMessage({
            price: res.data.last,
            change24h: parseFloat(res.data.change24h || "0")
          }, false) 
        }
      } catch (e) {}
    }

    // If data is cut, trigger mock immediately
    this.socket.onerror = () => this.startMock(onMessage)
    this.socket.onclose = () => this.startMock(onMessage)
  }

  private startMock(onMessage: (data: any, isMock: boolean) => void) {
    if (this.usingMock) return
    this.usingMock = true

    this.mockInterval = setInterval(() => {
      const rand = Math.random()
      if (rand > 0.90) this.price += Math.random() * 500
      else if (rand > 0.80) this.price -= Math.random() * 400
      else this.price += (Math.random() - 0.5) * 50

      onMessage({
        price: parseFloat(this.price.toFixed(2)),
        change24h: 1.2,
        volume: 1200
      }, true)
    }, 1100)
  }

  private stopMock() {
    if (this.mockInterval) clearInterval(this.mockInterval)
    this.mockInterval = null
  }

  disconnect() {
    if (this.socket) this.socket.close()
    this.stopMock()
    this.usingMock = false
  }
}

export const hybridCryptoService = new HybridCryptoService()