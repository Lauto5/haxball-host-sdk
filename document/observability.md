# 📊 Observability Documentation

Welcome to the **Observability Guide**. This documentation covers the logging and metrics capabilities of the Haxball Host SDK.

---

## Overview

The SDK includes a comprehensive observability system with two main pillars:

- **Logging** → Structured logs with multiple levels (trace, debug, info, warn, error)
- **Metrics** → Performance and business metrics (increment, gauge, observe)

All components are connected through the central `Observability` class.

---

## 📝 Logging

### Log Levels

The SDK supports 6 log levels, ordered from least to most verbose:

```typescript
enum LogLevel {
  OFF = 0,      // Off logger
  ERROR = 1,    // Only errors
  WARN = 2,     // Warnings and errors
  INFO = 3,     // General information (default)
  DEBUG = 4,    // Detailed debug information
  TRACE = 5     // Very detailed trace information
}
```

### Logger interface

```typescript
interface ILogger {
  error(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  info(message: string, meta?: unknown): void;
  debug(message: string, meta?: unknown): void;
  trace(message: string, meta?: unknown): void;
}
```

## 📈 Metrics interface

```typescript
export interface IMetrics {
  
  increment(name: string, value?: number, labels?: Record<string, string>): void;
  
  gauge(name: string, value: number, labels?: Record<string, string>): void;
  
  observe(name: string, value: number, labels?: Record<string, string>): void;
  
}
```

### Metric Types

The SDK supports three types of metrics:

#### 1. Counter (Increment)
Tracks the number of occurrences of an event.

#### 2. Gauge
Represents a current value at a point in time.

#### 3. Histogram (Observe)
Records the distribution of values (e.g., duration, size).

---

## ⚙️ Configuration

### Default Configuration

The SDK comes with a default observability setup:

```typescript
// Default: INFO level logging with console output
const sdk = new HaxballHostSDK();
```

---

## 💡 Examples

### Example 1: Use log default(ConsoleLogger internal)

```typescript
import { HaxballHostSDK, ObservabilityConfig, LogLevel } from "haxball-host-sdk";

// Setup observability
const obsConfig = new ObservabilityConfig(LogLevel.DEBUG);
const sdk = new HaxballHostSDK(obsConfig);
```

### Example 2: Inject you logger and metrics

```typescript
import { HaxballHostSDK, ObservabilityConfig, LogLevel , ILogger, IMetrics} from "haxball-host-sdk";

// ILogger
const myLogger = {
  
  error(message: string, meta?: unknown): void{
    // you implementation
  },
  warn(message: string, meta?: unknown): void{
    // you implementation
  },
  info(message: string, meta?: unknown): void{
    // you implementation
  },
  debug(message: string, meta?: unknown): void{
    // you implementation
  },
  trace(message: string, meta?: unknown): void{
    // you implementation
  }
};

// IMetrics
const myMetrics = {
  increment(name: string, value?: number, labels?: Record<string, string>): void{
    // you implementation
  },
  
  gauge(name: string, value: number, labels?: Record<string, string>): void{
    // you implementation
  },
  
  observe(name: string, value: number, labels?: Record<string, string>): void{
    // you implementation
  }
}

// Setup observability
const obsConfig = new ObservabilityConfig(LogLevel.DEBUG , myLogger , myMetrics);
const sdk = new HaxballHostSDK(obsConfig);
```

---

## 🔗 Other guides

- [Setup sdk config](./setup-sdk-config.md)
- [Haxball models](./haxball-models.md)
- [Room API](./room-api.md)
- [First steps](./first-steps.md)
