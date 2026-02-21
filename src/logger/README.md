# 📋 Módulo: Logger

## 1. Vision General

Este módulo es el responsable de **reportar y registrar cada evento** que el sistema ejecuta. Su objetivo principal es centralizar la observabilidad, permitiendo tener un control total y una trazabilidad clara de lo que ocurre en el sistema en tiempo real.

## 2. Características Principales

* ✨ **Simple**: Diseñado para ser intuitivo. Su implementación en otros módulos es directa y sin fricción.

* 🛠️ **Adaptable**: Aunque por defecto utiliza `ConsoleLogger`, permite la inyección de cualquier provider externo que respete el contrato `ILogger`.

* 🛡️ Seguro: Utiliza el patrón Wrapper mediante `SafeLogger`. Esto garantiza que, aunque un provider falle o no esté implementado correctamente, el sistema principal **nunca se rompa** al intentar emitir un log.

## 3. Estructura de Carpetas (logger/)

* **`decorators/`** : Lógica de aumento para el logger.
    * **`safeLogger.ts`** : Blindaje contra errores de ejecución.
    * **`scopedLogger.ts`** : Añade contexto (tags) a los mensajes (ej: `[Bridge]`).
* **`interfaces/`** : Contratos definitivos.
    * **`logger.interface.ts`** : Define el estándar `ILogger`.
* **`provider/`** : Implementaciones concretas.
    * **`consoleLogger.ts`** : Salida estándar por consola.
* **`constants.ts`** : niveles de logeo.
* **`index.ts`** : **🚪 Único punto de entrada público del módulo.**

## 4. Ejemplo de Uso

```typescript

// ejemplo en modulo bridge

export class Bridge {
  private logger: ILogger;

  constructor(rootLogger: ILogger) {
    // Usamos ScopedLogger para que cada log diga "[Bridge]" automáticamente
    this.logger = new ScopedLogger(rootLogger, "Bridge");
  }
}

// ejemplo en el core principal
export class HaxballHostSDK {
    private rootLogger: ILogger;

    constructor(options?: SDKOptions) {
        // 1. Elegimos el provider (consola por defecto o uno externo)
        const baseLogger = options?.logger ?? new ConsoleLogger();
        
        // 2. Lo envolvemos en SafeLogger para garantizar estabilidad
        this.rootLogger = new SafeLogger(baseLogger);
    }
}