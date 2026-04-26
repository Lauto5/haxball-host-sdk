<p align="center">
  <img src="./HaxballHostSdk_Icono.png" width="220" />
</p>

[![npm version](https://img.shields.io/npm/v/haxball-host-sdk)](https://www.npmjs.com/package/haxball-host-sdk)
[![npm downloads](https://img.shields.io/npm/dm/haxball-host-sdk)](https://www.npmjs.com/package/haxball-host-sdk)
[![GitHub repository](https://img.shields.io/badge/GitHub-Repositorio-181717?logo=github&style=flat)](https://github.com/Lauto5/haxball-host-sdk)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
[![GitHub stars](https://img.shields.io/github/stars/Lauto5/haxball-host-sdk?style=social)](https://github.com/Lauto5/haxball-host-sdk)

# 📘 HaxBall-host-sdk

**Advanced Node.js infrastructure for professional HaxBall host management.**

Developed by **Lauto5**, this SDK abstracts the complexity of the official HaxBall Headless API, allowing you to run, manage, and scale multiple rooms simultaneously from a structured, professional **Node.js** environment.

---

# 💻 How to install

```bash
npm i haxball-host-sdk
```

### Dependencies

```bash
npm i puppeteer # Downloads compatible Chrome during installation.
npm i puppeteer-core # Alternatively, install as a library, without downloading Chrome.
```

---

## 🏷️ What is it?

The official HaxBall API is designed exclusively for the browser. **HaxBall-host-sdk** removes that barrier, letting developers focus on game logic while the SDK takes care of:

- 🌐 **Browser Abstraction:** Automatic execution and management of the headless environment (Puppeteer).
- 🔄 **Multi-process Communication:** Internal handling of the bridge between Node.js and the browser.
- 🚦 **Instance Control:** Native management of multiple hosts within a single application.
- 📢 **Event Management:** Reactive system to capture every in-game action.

---

## 🚀 Why is it special?

Unlike a conventional *wrapper*, this SDK behaves as an **infrastructure layer** built on three pillars:

1. **Full Isolation (Multi-host):** Each host runs in its own environment with its own independent **Runtime**, **Bridge**, **Logger**, and **Domain**.
2. **Modular Architecture:** Designed with decoupled modules (Runtime, Bridge, Public API) to guarantee maintainability.
3. **Zero Persistence Opinion:** The SDK does not impose any database or data structure; it provides the technical foundation for you to build your own architecture on top.

---

## 🧠 Design Philosophy

The SDK follows rigorous engineering principles to ensure stability:

- ✅ **Separation of Concerns:** Each module has a single, clear responsibility.
- ✅ **Dependency Injection:** We avoid global Singletons, making testing and scaling easier.
- ✅ **Observability:** Structured logging at every layer so you always know what's happening internally in real time.
- ✅ **Clean Architecture:** Built to grow without turning into spaghetti code.

---

## 🏗️ Project Map

To understand how the SDK is built, check out our detailed documentation:

- [**First steps**](./document/first-steps.md): Learn how to use the SDK.
- *(Coming soon)* **Contribution Documentation:** Details on how you can contribute to the project.

---

## 🎯 Goal

To provide a **clean, scalable, and professional** infrastructure that allows developers to build high-level HaxBall server logic without dealing with the technical complexity of the headless environment.
