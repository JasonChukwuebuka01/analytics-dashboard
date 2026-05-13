export interface MarketLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error';
}

export interface ChartPoint {
  timestamp: string;
  value: number;
}