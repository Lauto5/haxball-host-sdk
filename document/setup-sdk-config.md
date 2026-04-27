# 🤓 Setup config

The SDK configuration is simple; it consists of two optional pillars.

## Default configuration
```typescript
const haxballHost = new haxballHost(); // Default
```

## your configuration
```typescript

// Here you can inject your own implementation of logger and metrics.
const obsConfig = new ObservabilityConfig(LogLevel.DEBUG , undefined , undefined);

const setupConfig = new SetupEngineConfig("puppeteer", "usr/bin/chromium-browser", undefined);

const haxballHost = new haxballHost(obsConfig , setupConfig);
```

# other guides

- [First steps](./first-steps.md)
- [Room API](./room-api.md)
- [Haxball models](./haxball-models.md)
- [Observability](./observability.md)