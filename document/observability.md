# 📊 Observability Documentation

Welcome to the **Observability Guide**. This documentation covers the logging, metrics, and tracing capabilities of the Haxball Host SDK.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Logging](#logging)
3. [Metrics](#metrics)
4. [Tracing](#tracing)
5. [Configuration](#configuration)
6. [Examples](#examples)

---

## Overview

The SDK includes a comprehensive observability system with three main pillars:

- **Logging** → Structured logs with multiple levels (trace, debug, info, warn, error)
- **Metrics** → Performance and business metrics (increment, gauge, observe)
- **Tracing** → Distributed tracing with traces and spans for request tracking

All components are connected through the central `Observability` class.

---

## 📝 Logging

### Log Levels

The SDK supports 5 log levels, ordered from least to most verbose:

```typescript
enum LogLevel {
  ERROR = 0,    // Only errors
  WARN = 1,     // Warnings and errors
  INFO = 2,     // General information (default)
  DEBUG = 3,    // Detailed debug information
  TRACE = 4     // Very detailed trace information
}
```

### Using the Logger

#### Get a Scoped Logger

```typescript
const logger = observability.createScopeLogger("MyComponent");

logger.error("An error occurred", { errorCode: 500 });
logger.warn("This is a warning", { reason: "timeout" });
logger.info("Application started");
logger.debug("Debug information", { variable: value });
logger.trace("Trace level detail", { traceData: true });
```

#### Logger Methods

```typescript
interface ILogger {
  error(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  info(message: string, meta?: unknown): void;
  debug(message: string, meta?: unknown): void;
  trace(message: string, meta?: unknown): void;
}
```

### Example: Logging in Your Room Handler

```typescript
const logger = observability.createScopeLogger("RoomHandler");

room.onPlayerJoin((player) => {
  logger.debug("Player joined", {
    playerId: player.id,
    playerName: player.name,
    team: player.team
  });
});

room.onGameStart(() => {
  logger.info("Game started successfully");
});

room.onPlayerKicked((player, reason, ban) => {
  logger.warn("Player kicked", {
    playerId: player.id,
    reason: reason,
    banned: ban
  });
});
```

---

## 📈 Metrics

### Metric Types

The SDK supports three types of metrics:

#### 1. Counter (Increment)
Tracks the number of occurrences of an event.

```typescript
// Increment by 1 (default)
metrics.increment("room.created");

// Increment by a specific value
metrics.increment("players.connected", 5);

// With labels
metrics.increment("method.calls", 1, {
  method: "sendChat",
  status: "success"
});
```

#### 2. Gauge
Represents a current value at a point in time.

```typescript
// Set current active rooms
metrics.gauge("rooms.active", 10);

// With labels
metrics.gauge("room.player.count", 8, {
  roomId: "room-123"
});
```

#### 3. Histogram (Observe)
Records the distribution of values (e.g., duration, size).

```typescript
const startTime = Date.now();
// ... do some work ...
const duration = Date.now() - startTime;

metrics.observe("request.duration", duration, {
  endpoint: "/api/rooms",
  status: "200"
});
```

### Using Scoped Metrics

Create metrics with predefined labels that are automatically added to all metrics:

```typescript
const metrics = observability.createScopeMetrics({
  component: "Bridge",
  layer: "infrastructure"
});

// These will automatically include the scope labels
metrics.increment("operation.count");
metrics.observe("operation.duration", 150);
```

### Example: Metrics in Room Operations

```typescript
const metrics = observability.createScopeMetrics({ roomId: "my-room" });

room.onPlayerJoin((player) => {
  metrics.increment("players.joined", 1, { team: player.team });
});

room.onPlayerLeave((player) => {
  metrics.increment("players.left", 1, { team: player.team });
});

room.onTeamGoal((team) => {
  metrics.increment("goals.scored", 1, { team: team });
});

room.onGameStart(() => {
  metrics.increment("games.started");
});

// Track player count every 5 seconds
setInterval(async () => {
  const players = await room.getPlayerList();
  metrics.gauge("room.player.count", players.length);
}, 5000);
```

---

## 🔍 Tracing

### What is Tracing?

Tracing provides end-to-end visibility into request flows through your system. A trace consists of:

- **Trace** → A single request or operation (identified by a unique trace ID)
- **Span** → A logical unit of work within a trace (with its own span ID)

### Creating Traces and Spans

```typescript
const tracer = observability.getTracer();

// Start a trace
const trace = tracer.startTrace("handleRoomCreation");

// Create spans for different phases
const initSpan = trace.startSpan("initialize_room");
// ... do initialization work ...
initSpan.end();

const configSpan = trace.startSpan("configure_settings");
// ... do configuration work ...
configSpan.end();
```

### Trace Metadata

Each trace and span includes:

- **Trace ID** → Unique identifier for the entire operation
- **Span ID** → Unique identifier for a specific unit of work
- **Duration** → How long the span took to execute
- **Name** → Description of what the span does

### Example: Complete Tracing Flow

```typescript
const tracer = observability.getTracer();

room.onGameStart((byPlayer) => {
  const trace = tracer.startTrace("game_start_sequence");
  
  // Validate players
  const validateSpan = trace.startSpan("validate_players");
  // ... validation logic ...
  validateSpan.end();
  
  // Setup game state
  const setupSpan = trace.startSpan("setup_game_state");
  // ... setup logic ...
  setupSpan.end();
  
  // Initialize physics
  const physicsSpan = trace.startSpan("init_physics");
  // ... physics logic ...
  physicsSpan.end();
  
  console.log(`Game start trace: ${trace.traceId}`);
});
```

---

## ⚙️ Configuration

### Default Configuration

The SDK comes with a default observability setup:

```typescript
// Default: INFO level logging with console output
const sdk = new HaxballHostSDK();
```

### Custom Configuration

You can configure observability when creating the SDK:

```typescript
import { 
  HaxballHostSDK,
  ObservabilityConfig,
  LogLevel,
  ConsoleLogger,
  ConsoleMetrics
} from "haxball-host-sdk";

// Custom logger with DEBUG level
const customLogger = new ConsoleLogger(LogLevel.DEBUG);
const customMetrics = new ConsoleMetrics(customLogger);

const obsConfig = new ObservabilityConfig(LogLevel.DEBUG, customLogger, customMetrics);
const sdk = new HaxballHostSDK(obsConfig);
```

### Available Log Levels

```typescript
import { LogLevel } from "haxball-host-sdk";

// Use different levels based on environment
const level = process.env.NODE_ENV === "production" 
  ? LogLevel.INFO 
  : LogLevel.DEBUG;

const obsConfig = new ObservabilityConfig(level);
const sdk = new HaxballHostSDK(obsConfig);
```

---

## 💡 Examples

### Example 1: Complete Room with Full Observability

```typescript
import { HaxballHostSDK, ObservabilityConfig, LogLevel } from "haxball-host-sdk";

// Setup observability
const obsConfig = new ObservabilityConfig(LogLevel.DEBUG);
const sdk = new HaxballHostSDK(obsConfig);

const room = await sdk.launchRoom({
  roomName: "Observable Room",
  maxPlayers: 10,
  public: true,
  noPlayer: true,
  token: "YOUR_TOKEN_HERE"
});

// Get observability components
const logger = sdk.observability.createScopeLogger("RoomManager");
const metrics = sdk.observability.createScopeMetrics({ roomName: "Observable Room" });
const tracer = sdk.observability.getTracer();

// Monitor room link
room.onRoomLink((url) => {
  logger.info("Room link generated", { url });
  metrics.increment("room.created");
});

// Track player activity
room.onPlayerJoin((player) => {
  logger.debug("Player joined", { playerId: player.id, name: player.name });
  metrics.increment("players.joined", 1, { team: player.team });
});

room.onPlayerLeave((player) => {
  logger.debug("Player left", { playerId: player.id });
  metrics.increment("players.left", 1, { team: player.team });
});

// Trace game operations
room.onGameStart(() => {
  const trace = tracer.startTrace("game_start");
  
  const setupSpan = trace.startSpan("setup");
  logger.info("Game started");
  metrics.increment("games.started");
  setupSpan.end();
});

// Monitor scores with metrics
room.onTeamGoal((team) => {
  logger.info("Goal scored", { team });
  metrics.increment("goals.scored", 1, { team });
});

// Track room status periodically
setInterval(async () => {
  try {
    const players = await room.getPlayerList();
    const scores = await room.getScores();
    
    metrics.gauge("room.player.count", players.length);
    if (scores) {
      metrics.gauge("room.score.red", scores.red);
      metrics.gauge("room.score.blue", scores.blue);
    }
  } catch (err) {
    logger.error("Error collecting room metrics", err);
  }
}, 10000);
```

### Example 2: Performance Monitoring

```typescript
const tracer = observability.getTracer();
const metrics = observability.createScopeMetrics({ module: "api" });

async function executeRoomMethod(methodName: string, ...args: any[]) {
  const trace = tracer.startTrace(`room_method_${methodName}`);
  const span = trace.startSpan("execute");
  
  const startTime = Date.now();
  
  try {
    const result = await room[methodName](...args);
    const duration = Date.now() - startTime;
    
    metrics.observe("method.duration", duration, {
      method: methodName,
      status: "success"
    });
    
    logger.debug("Method executed", {
      method: methodName,
      duration,
      traceId: trace.traceId
    });
    
    return result;
  } catch (err) {
    const duration = Date.now() - startTime;
    
    metrics.observe("method.duration", duration, {
      method: methodName,
      status: "error"
    });
    
    logger.error("Method failed", {
      method: methodName,
      duration,
      error: err
    });
    
    throw err;
  } finally {
    span.end();
  }
}
```

### Example 3: Custom Metrics Dashboard

```typescript
const metrics = observability.createScopeMetrics({ dashboard: "room-stats" });
const logger = observability.createScopeLogger("Dashboard");

// Collect metrics every minute
setInterval(async () => {
  try {
    const players = await room.getPlayerList();
    const scores = await room.getScores();
    
    // Player statistics
    const redPlayers = players.filter(p => p.team === "red").length;
    const bluePlayers = players.filter(p => p.team === "blue").length;
    const spectators = players.filter(p => p.team === "spectators").length;
    
    metrics.gauge("players.red", redPlayers);
    metrics.gauge("players.blue", bluePlayers);
    metrics.gauge("players.spectators", spectators);
    metrics.gauge("players.total", players.length);
    
    // Score metrics
    if (scores) {
      metrics.gauge("score.red", scores.red);
      metrics.gauge("score.blue", scores.blue);
    }
    
    logger.info("Dashboard metrics updated", {
      total: players.length,
      red: redPlayers,
      blue: bluePlayers,
      spectators: spectators,
      scoreRed: scores?.red,
      scoreBlue: scores?.blue
    });
  } catch (err) {
    logger.error("Failed to collect dashboard metrics", err);
  }
}, 60000);
```

---

## 🔗 Other guides

- [Haxball models](./haxball-models.md)
- [Room API](./room-api.md)
- [First steps](./first-steps.md)
