# 🚀 Getting Started

Welcome to **Haxball Host SDK**, an infrastructure for creating and managing HaxBall hosts from Node.js in a professional manner.

In this guide you will create your first room in less than 2 minutes.

---

# ⚠️ Requirements

- Node.js 18+
- Chromium / Chrome installed (for Puppeteer)

---

## 📦 Install

```bash
npm i haxball-host-sdk
```

### Dependencies

```bash
npm i puppeteer # Downloads compatible Chrome during installation.
npm i puppeteer-core # Alternatively, install as a library, without downloading Chrome.
```

# ⚡ First Host

```typescript
import { HaxballHost } from "haxball-host-sdk";

const sdk = new HaxballHost();

const room = await sdk.launchRoom({
  roomName: "I like haxball :)",
  maxPlayers: 10,
  public: true,
  noPlayer: true,
  token: "YOUR_TOKEN_HERE"
});
```

# 🧠 Key Concepts

- **Room** → It represents a HaxBall room
- **Events** → Everything that happens in the room (players, game, chat)
- **Methods** → Actions you can perform on the room
- **Multi-host** → You can run multiple rooms in parallel, but with the limitation of 2 public hosts per IP, then the ability to create many private hosts

# 📊 Observability (optional)

The SDK includes support for:

- logging
- Metrics

# 🚀 Next Step

Now that you have your first room up and running:

👉 Review the complete documentation:

- [Setup sdk config](./setup-sdk-config.md)
- [Room API](./room-api.md)
- [Haxball models](./haxball-models.md)
- [Observability](./observability.md)