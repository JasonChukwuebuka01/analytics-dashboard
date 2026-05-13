# Vortex.OS // Real-Time Data Visualization Terminal

## Project Overview

Vortex.OS is a high-performance, production-grade real-time analytics dashboard built with Vue 3 and TypeScript. It is designed to simulate a mission-critical trading terminal, visualizing live BTC/USDT market data with sub-second latency. The platform prioritizes system resilience, rendering performance, and engineering maturity.


## Core Features

### 1. Hybrid Real-Time Data Streaming

WebSocket Integration: Consumes live trade data directly from the CEX WebSocket API.

Failover Resilience: Implements an automatic Mock Data Generator that triggers if the primary uplink fails, ensuring zero dashboard downtime.

### 2. Multi-Engine Visualizations

Line & Area Charts: High-frequency price tracking with gradient overlays.

Bar Charts: Dynamic transaction volume tracking that reacts to market volatility.

Real-Time Metric Cards: Instant telemetry for Price, Node Location, and Uplink Status.

### 3. Interactive Intelligence

Time-Window Slicing: Toggle between LIVE, 1m, 5m, and 1h views using reactive state filtering.

Activity Feed: A searchable, filtered log of market events with severity indicators (Info, Warning, Error).

Engine Control: Ability to manually initialize or terminate the data stream.


# Vortex.OS // Real-Time Data Visualization Terminal

## Project Overview

Vortex.OS is a high-performance, production-grade real-time analytics dashboard built with Vue 3 and TypeScript. It is designed to simulate a mission-critical trading terminal, visualizing live BTC/USDT market data with sub-second latency. The platform prioritizes system resilience, rendering performance, and engineering maturity.

## Core Features

### 1. Hybrid Real-Time Data Streaming

WebSocket Integration: Consumes live trade data directly from the Binance WebSocket API.

Failover Resilience: Implements an automatic Mock Data Generator that triggers if the primary uplink fails, ensuring zero dashboard downtime.

### 2. Multi-Engine Visualizations

Line & Area Charts: High-frequency price tracking with gradient overlays.

Bar Charts: Dynamic transaction volume tracking that reacts to market volatility.

Real-Time Metric Cards: Instant telemetry for Price, Node Location, and Uplink Status.

### 3. Interactive Intelligence

Time-Window Slicing: Toggle between LIVE, 1m, 5m, and 1h views using reactive state filtering.

Activity Feed: A searchable, filtered log of market events with severity indicators (Info, Warning, Error).

Engine Control: Ability to manually initialize or terminate the data stream.

## Technical Architecture

### State Management Strategy
The application utilizes Pinia for centralized data handling. Instead of passing raw data props, the system uses Computed Getters to perform "Data Slicing." This ensures that the heavy lifting of filtering thousands of data points happens in the store, keeping the components "dumb" and fast.

### Rendering Optimization Decisions

Throttled Updates: Using Chart.js update('none') mode to bypass the animation engine during high-frequency pings, significantly reducing CPU overhead.

Memory Management: Implements a strict Array.shift() strategy to maintain a fixed buffer size, preventing browser memory leaks over long-running sessions.

Cleanup Protocols: Explicitly destroying chart instances and clearing buffers on onUnmounted or stream termination to free up resources.

### Data Integrity
The project is built with TypeScript, utilizing strict Interfaces for all data models:

ChartPoint: Ensures timestamp/value consistency for visualizations.

MarketLog: Standardizes event logging across the application.

## Setup Instructions

### 1. Clone the Repository

```
git clone <your-repo-url>
cd vue-dashboard
```

### 2. Install Dependencies

```
npm install
```

### 3. Run Development Server

```
npm run dev
```

### 4. Build for Production

```
npm run build

```
## Engineering Trade-offs

Chart.js vs D3.js: Chart.js was selected for its balance of out-of-the-box performance and responsive scaling, which allowed for faster iteration on Requirement 2 while still meeting the performance goals of Requirement 4.

Polling vs WebSockets: While polling is easier to implement, WebSockets were used to satisfy the "Alive" feel of the dashboard, with a Mock Generator fallback to handle Requirement 8 (Resilience).