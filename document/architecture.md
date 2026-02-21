# 🏗️ Architecture

## 1. Visión General
Este proyecto utiliza una **arquitectura modular**. El objetivo es mantener un código escalable, testeable y fácil de mantener, donde cada funcionalidad reside en su propio compartimento.

## 2. Principios de Diseño
* **Modularidad:** Cada módulo es independiente y tiene una única responsabilidad (SRP).
* **Bajo acoplamiento:** Los módulos se comunican exclusivamente a través de **interfaces y APIs públicas**. Está estrictamente prohibido acceder a la lógica interna o archivos privados de otros módulos.

## 3. Estructura de Carpetas (src/)
* **`bridge/`**: Define el túnel de comunicación y los contratos entre procesos con el navegador.
* **`core/`**: Contiene la lógica central, orquestadores y configuraciones base.
* **`logger/`**: Sistema centralizado de eventos y registro de errores.
* **`types/`**: Tipado global y definiciones compartidas.
* **`index.ts`**: Punto de entrada de la aplicación.

## 4. 🚫 Regla Inmutable
**Respetar la arquitectura y el diseño del proyecto es obligatorio. Prohibido romper el encapsulamiento de los módulos o crear dependencias circulares.** *Cualquier cambio que afecte la estructura base debe ser discutido previamente.*