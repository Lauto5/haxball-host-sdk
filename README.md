
<p align="center">
  <img src="./HaxballHostSdk_Icono.png" width="120" />
</p>

# 📘 HaxBall-host-sdk

**Infraestructura avanzada en Node.js para la gestión profesional de hosts de HaxBall.**

Desarrollado por **Lauto5**, este SDK abstrae la complejidad de la API oficial Headless de HaxBall, permitiendo ejecutar, administrar y escalar múltiples salas simultáneamente desde un entorno **Node.js** estructurado y profesional.

---

## 🏷️ ¿Qué es?

La API oficial de HaxBall está diseñada exclusivamente para el navegador. **HaxBall-host-sdk** elimina esa barrera, permitiendo a los desarrolladores centrarse en la lógica del juego mientras el SDK se encarga de:

* 🌐 **Abstracción del Navegador:** Ejecución automática y gestión del entorno headless (Puppeteer).
* 🔄 **Comunicación Multi-proceso:** Manejo interno del puente entre Node.js y el navegador.
* 🚦 **Control de Instancias:** Gestión nativa de múltiples hosts en una sola aplicación.
* 📢 **Gestión de Eventos:** Sistema reactivo para capturar cada acción del juego.

---

## 🚀 ¿Por qué es especial?

A diferencia de un *wrapper* convencional, este SDK se comporta como una **capa de infraestructura** basada en cuatro pilares:

1. **Bridge Híbrido (RPC + Event Bus):** Combina comandos directos (RPC) con un bus de eventos reactivo, replicando la naturaleza asíncrona de HaxBall.
2. **Aislamiento Total (Multi-host):** Cada host funciona en su propio entorno con su propio **Runtime**, **Bridge** y **Logger** independiente.
3. **Arquitectura Modular:** Diseñado con módulos desacoplados (Runtime, Transport, Bridge, API Pública) para garantizar mantenibilidad.
4. **Cero Opinión de Persistencia:** El SDK no impone bases de datos ni estructuras de datos; proporciona la base técnica para que tú construyas tu propia arquitectura encima.

---

## 🧠 Filosofía de Diseño

El SDK sigue principios rigurosos de ingeniería para asegurar la estabilidad:

* ✅ **Separación de Responsabilidades:** Cada módulo tiene una misión única y clara.
* ✅ **Inyección de Dependencias:** Evitamos el uso de Singletons globales, facilitando el testing y la escalabilidad.
* ✅ **Observabilidad:** Logging estructurado en cada capa para entender qué ocurre internamente en tiempo real.
* ✅ **Clean Architecture:** Preparado para crecer sin convertirse en código espagueti.

---

## 🏗️ Mapa del Proyecto

Para entender cómo está construido el SDK, consulta nuestra documentación detallada:

* [**Documentación de Arquitectura**](./docs/architecture.md): Principios, reglas inmutables y flujo de datos.
* [**Módulo Logger**](./src/logger/README.md): Cómo funciona nuestro sistema de trazabilidad.
* *(Próximamente)* **Módulo Bridge**: Detalles sobre el sistema RPC y eventos.

---

## 🎯 Objetivo

Proveer una infraestructura **limpia, escalable y profesional** que permita a los desarrolladores construir lógica de servidores de HaxBall de alto nivel sin lidiar con la complejidad técnica del entorno headless.
