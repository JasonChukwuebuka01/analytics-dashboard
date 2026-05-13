export class MockCryptoService {
  private interval: ReturnType<typeof setInterval> | null = null;
  private price = 67250; // starting BTC price

  connect(onMessage: (data: any) => void) {
    console.log("🔥 Mock Real-Time Streaming Started (MockCryptoService)");

    this.interval = setInterval(() => {
      // Simulate small price movement
      const change = (Math.random() - 0.5) * 80; // ±40 USD
      this.price = Math.max(60000, Math.min(72000, this.price + change));

      const mockData = {
        symbol: "BTCUSDT",
        price: parseFloat(this.price.toFixed(2)),
        high: parseFloat((this.price + 120).toFixed(2)),
        low: parseFloat((this.price - 180).toFixed(2)),
        volume: parseFloat((Math.random() * 1200 + 800).toFixed(2)),
        timestamp: Date.now(),
        change24h: parseFloat((Math.random() * 4 - 1.5).toFixed(2)) // -1.5% to +2.5%
      };

      onMessage(mockData);
    }, 1500); // Update every 1.5 seconds (feels real-time)
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const mockCryptoService = new MockCryptoService();