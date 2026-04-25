# 🚀 Getting Started

Welcome to **Haxball Host SDK**, an infrastructure for creating and managing HaxBall hosts from Node.js in a professional manner.

In this guide you will create your first room in less than 2 minutes.

---

## 📦 Instalación

```bash
npm install haxball-host-sdk
```

# ⚡ First Host

```typescript
import { HaxballHostSDK } from "haxball-host-sdk";

const sdk = new HaxballHostSDK();

const room = await sdk.launchRoom({
  roomName: "My Room",
  maxPlayers: 10,
  public: true,
  noPlayer: true,
  token: "YOUR_TOKEN_HERE"
});
```

# 🎮 Listen to Events

```typescript
room.onPlayerJoin((player) => {
  console.log("Player joined:", player.name);
});

room.onPlayerLeave((player) => {
  console.log("Player left:", player.name);
});

room.onPlayerChat((player, message) => {
  console.log(player.name, ":", message);
});
```

# ⚙️ Execute Methods

```typescript

// Send message to chat
await room.sendChat("Welcome!");

// Start game
await room.startGame();

// Stop game
await room.stopGame();

```

# 💬 Chat Commands

```typescript
room.onPlayerCommand((player, command) => {
  
  if (command === "!startGame") {
    room.startGame();
  }

  if (command === "!stopGame") {
    room.stopGame();
  }

});
```

💡 The commands are not displayed in the chat (they are already intercepted by the SDK).

# 🧠 Key Concepts

- **Room** → It represents a HaxBall room
- **Events** → Everything that happens in the room (players, game, chat)
- **Methods** → Actions you can perform on the room
- **Multi-host** → You can run multiple rooms in parallel, but with the limitation of 2 public hosts per IP, then the ability to create many private hosts

# 📊 Observability (optional)

The SDK includes support for:

- Structured logging
- Metrics
- Traces

# ⚠️ Requirements

- Node.js 18+
- Chromium / Chrome installed (for Puppeteer)

# 🚀 Next Step

Now that you have your first room up and running:

👉 Review the complete documentation:

- [Room API Documentation](./room-api.md)
- [Observability](./observability.md)

# 🧩 Complete Example

```typescript

import { HaxballHostSDK } from "haxball-host-sdk";

async function main() {
  
  const sdk = new HaxballHostSDK();

  const room = await sdk.launchRoom({
    roomName: "My Room",
    maxPlayers: 10,
    public: true,
    noPlayer: true,
    token: "YOUR_TOKEN_HERE"
  });

  room.onPlayerJoin((player) => {
    console.log("Joined:", player.name);
  });

  room.onPlayerCommand((player, command) => {
    
    if (command === "!startGame") {
      room.startGame();
    }

  });

}

main();
```