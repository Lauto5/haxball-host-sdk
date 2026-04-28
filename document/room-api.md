# 🎮 Room API Documentation

Welcome to the **Room API** documentation. This guide covers all available methods and events you can use to control and monitor HaxBall rooms.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Room Methods](#room-methods)
3. [Room Events](#room-events)
4. [Examples](#examples)

---

## Overview

The **Room** object is the main interface for interacting with a HaxBall room. It provides:

- **Methods** → Actions you can perform on the room (send messages, manage players, control the game)
- **Events** → Listeners for everything that happens in the room (players joining, scoring, etc.)

Every method is asynchronous and returns a `Promise`. All events use a callback-based pattern.

---

## 🔧 Room Methods

### Communication Methods

#### `sendChat(message: string, targetId?: number): Promise<void>`

Sends a message to the room chat.

```typescript
// Send to all players
await room.sendChat("Hello everyone!");

// Send to a specific player
await room.sendChat("Hello Player!", 5);
```

#### `sendAnnouncement(message: string, targetId?: number, color?: number, style?: number, sound?: number): Promise<void>`

Sends an announcement with customization options.

```typescript
await room.sendAnnouncement(
  "Match starting in 10 seconds!",
  undefined, // targetId - undefined for all players
  0xFF0000,  // color - Red in hexadecimal
  1,         // style - Text style
  1          // sound - Sound notification
);
```

---

### Player Management Methods

#### `setPlayerAdmin(playerId: number, admin: boolean): Promise<void>`

Sets or removes admin status from a player.

```typescript
// Make player admin
await room.setPlayerAdmin(3, true);

// Remove admin status
await room.setPlayerAdmin(3, false);
```

#### `setPlayerTeam(playerId: number, team: TeamID): Promise<void>`

Changes a player's team. TeamID can be `"red"`, `"blue"`, or `"spectators"`.

```typescript
await room.setPlayerTeam(5, "red");
await room.setPlayerTeam(6, "blue");
await room.setPlayerTeam(7, "spectators");
```

#### `kickPlayer(playerId: number, reason: string, ban: boolean): Promise<void>`

Kicks a player from the room with optional ban.

```typescript
// Kick without banning
await room.kickPlayer(2, "Inactive player", false);

// Kick and ban
await room.kickPlayer(2, "Cheating", true);
```

#### `clearBan(playerId: number): Promise<void>`

Removes a ban for a specific player.

```typescript
await room.clearBan(2);
```

#### `clearBans(): Promise<void>`

Clears all bans in the room.

```typescript
await room.clearBans();
```

#### `setPlayerAvatar(playerId: number, avatar: string): Promise<void>`

Sets a player's avatar.

```typescript
await room.setPlayerAvatar(1, "https://example.com/avatar.png");
```

#### `reorderPlayers(playerIds: number[], moveToTop: boolean): Promise<void>`

Reorders players in the player list.

```typescript
// Move to top
await room.reorderPlayers([1, 2, 3], true);

// Move to bottom
await room.reorderPlayers([4, 5], false);
```

---

### Room Settings Methods

#### `setScoreLimit(limit: number): Promise<void>`

Sets the score limit for the match.

```typescript
await room.setScoreLimit(5); // First team to 5 goals wins
```

#### `setTimeLimit(limitInMinutes: number): Promise<void>`

Sets the time limit for the match.

```typescript
await room.setTimeLimit(10); // 10 minute match
```

#### `setPassword(password: string | null): Promise<void>`

Sets or removes the room password.

```typescript
// Set password
await room.setPassword("secretpass123");

// Remove password
await room.setPassword(null);
```

#### `setRequireRecaptcha(enabled: boolean): Promise<void>`

Requires or disables reCAPTCHA verification for joining.

```typescript
await room.setRequireRecaptcha(true);
await room.setRequireRecaptcha(false);
```

#### `setTeamsLock(locked: boolean): Promise<void>`

Locks or unlocks teams (prevents players from changing teams).

```typescript
await room.setTeamsLock(true);
```

#### `setTeamColors(team: TeamID, angle: number, textColor: number, colors: number[]): Promise<void>`

Customizes team colors.

```typescript
await room.setTeamColors(
  "red",
  0,          // angle
  0xFFFFFF,   // text color (white)
  [0xFF0000]  // team colors (red)
);
```

#### `setKickRateLimit(min: number, rate: number, burst: number): Promise<void>`

Sets kick rate limits to prevent spam.

```typescript
await room.setKickRateLimit(
  10, // minimum value
  5,  // rate
  3   // burst
);
```

---

### Stadium Methods

#### `setDefaultStadium(name: string): Promise<void>`

Sets a default stadium by name.

```typescript
await room.setDefaultStadium("Classic");
await room.setDefaultStadium("Big");
```

#### `setCustomStadium(hbs: string): Promise<void>`

Loads a custom stadium from HBS content.

```typescript
const hbsContent = "..."; // Your HBS stadium data
await room.setCustomStadium(hbsContent);
```

---

### Game Control Methods

#### `getRoomLink(): Promise<string | null>`

```typescript
  const link_room1 = await room.getRoomLink();
```

#### `startGame(): Promise<void>`

Starts the game.

```typescript
await room.startGame();
```

#### `stopGame(): Promise<void>`

Stops the current game.

```typescript
await room.stopGame();
```

#### `pauseGame(pauseState: boolean): Promise<void>`

Pauses or unpauses the game.

```typescript
// Pause
await room.pauseGame(true);

// Resume
await room.pauseGame(false);
```

---

### Game State Methods

#### `getPlayer(playerId: number): Promise<Player | null>`

Gets information about a specific player.

```typescript
const player = await room.getPlayer(1);
if (player) {
  console.log(player.name, player.team, player.position);
}
```

#### `getPlayerList(): Promise<Player[]>`

Gets a list of all players in the room.

```typescript
const players = await room.getPlayerList();
players.forEach(player => {
  console.log(player.name);
});
```

#### `getScores(): Promise<Scores | null>`

Gets current match scores.

```typescript
const scores = await room.getScores();
if (scores) {
  console.log("Red team:", scores.red, "Blue team:", scores.blue);
}
```

#### `getBallPosition(): Promise<Position | null>`

Gets the current ball position.

```typescript
const ballPos = await room.getBallPosition();
if (ballPos) {
  console.log(`Ball at (${ballPos.x}, ${ballPos.y})`);
}
```

---

### Recording Methods

#### `startRecording(): Promise<void>`

Starts recording the game.

```typescript
await room.startRecording();
```

#### `stopRecording(): Promise<Uint8Array>`

Stops recording and returns the recording data.

```typescript
const recordingData = await room.stopRecording();
// Save recordingData to a file or process it
```

---

### Physics Methods

#### `setDiscProperties(discIndex: number, properties: DiscProperties): Promise<void>`

Sets properties for a specific disc (ball).

```typescript
await room.setDiscProperties(0, {
  x: 0,
  y: 0,
  vx: 10,
  vy: 5,
  gravity: 0.11
});
```

#### `getDiscProperties(discIndex: number): Promise<DiscProperties>`

Gets properties for a specific disc.

```typescript
const discProps = await room.getDiscProperties(0);
console.log(discProps);
```

#### `setPlayerDiscProperties(playerId: number, properties: DiscProperties): Promise<void>`

Sets physical properties for a player disc.

```typescript
await room.setPlayerDiscProperties(1, {
  x: 200,
  y: 0,
  damping: 0.99,
});
```

#### `getPlayerDiscProperties(playerId: number): Promise<DiscProperties>`

Gets physical properties for a player disc.

```typescript
const playerDiscProps = await room.getPlayerDiscProperties(1);
console.log(playerDiscProps);
```

#### `getDiscCount(): Promise<number>`

Gets the total number of discs in the room.

```typescript
const discCount = await room.getDiscCount();
console.log(`Total discs: ${discCount}`);
```

---

## 💡 Room Events

### Player Events

#### `onPlayerJoin(callback: (player: Player) => void): void`

Triggered when a player joins the room.

```typescript
room.onPlayerJoin((player) => {
  console.log(`${player.name} joined the game!`);
});
```

#### `onPlayerLeave(callback: (player: Player) => void): void`

Triggered when a player leaves the room.

```typescript
room.onPlayerLeave((player) => {
  console.log(`${player.name} left the game!`);
});
```

#### `onPlayerChat(callback: (player: Player, message: string) => boolean | void): void`

Triggered when a player sends a chat message. Return `false` to block the message.

```typescript
room.onPlayerChat((player, message) => {
  console.log(`${player.name}: ${message}`);
  // Return false to prevent the message from being displayed
  if (message.includes("badword")) {
    return false;
  }
});
```

#### `onPlayerCommand(callback: (player: Player, command: string) => void): void`

Triggered when a player sends a command (starts with `!`). Commands are not displayed in chat.

```typescript
room.onPlayerCommand((player, command) => {
  if (command === "!help") {
    room.sendAnnouncement("Available commands: !help, !stats" , player.id);
  }
});
```

#### `onPlayerActivity(callback: (player: Player) => void): void`

Triggered when a player is active (moves, kicks, etc.).

```typescript
room.onPlayerActivity((player) => {
  console.log(`${player.name} is active`);
});
```

#### `onPlayerBallKick(callback: (player: Player) => void): void;`

This method may be somewhat irregular due to the way the official Haxball
API works; use it with caution.

```typescript
onPlayerBallKick(callback: (player: Player) => {
  room.kickPlayer(player.id , "Haha!" , true);
});
```

---

### Admin Events

#### `onPlayerAdminChange(callback: (changedPlayer: Player, byPlayer: Player | null) => void): void`

Triggered when a player's admin status changes.

```typescript
room.onPlayerAdminChange((changedPlayer, byPlayer) => {
  const adminName = byPlayer?.name || "System";
  console.log(`${adminName} changed ${changedPlayer.name}'s admin status`);
});
```

#### `onPlayerTeamChange(callback: (changedPlayer: Player, byPlayer: Player | null) => void): void`

Triggered when a player switches teams.

```typescript
room.onPlayerTeamChange((changedPlayer, byPlayer) => {
  console.log(`${changedPlayer.name} switched to ${changedPlayer.team}`);
});
```

#### `onPlayerKicked(callback: (kickedPlayer: Player, reason: string, ban: boolean, byPlayer: Player | null) => void): void`

Triggered when a player is kicked.

```typescript
room.onPlayerKicked((kickedPlayer, reason, ban, byPlayer) => {
  const adminName = byPlayer?.name || "System";
  const banStatus = ban ? "and banned" : "";
  console.log(`${adminName} kicked ${kickedPlayer.name} ${banStatus}. Reason: ${reason}`);
});
```

---

### Game Events

#### `onGameStart(callback: (byPlayer: Player | null) => void): void`

Triggered when the game starts.

```typescript
room.onGameStart((byPlayer) => {
  const starter = byPlayer?.name || "System";
  console.log(`Game started by ${starter}`);
});
```

#### `onGameStop(callback: (byPlayer: Player | null) => void): void`

Triggered when the game stops.

```typescript
room.onGameStop((byPlayer) => {
  console.log("Game stopped");
});
```

#### `onGameTick(callback: () => void): void`

Triggered every frame during an active game (high frequency event).

```typescript
room.onGameTick(() => {
  // Do something every game tick
  // Use sparingly as this fires very frequently
});
```

#### `onGamePause(callback: (byPlayer: Player | null) => void): void`

Triggered when the game is paused.

```typescript
room.onGamePause((byPlayer) => {
  console.log("Game paused");
});
```

#### `onGameUnpause(callback: (byPlayer: Player | null) => void): void`

Triggered when the game is resumed.

```typescript
room.onGameUnpause((byPlayer) => {
  console.log("Game resumed");
});
```

#### `onPositionsReset(callback: () => void): void`

Triggered when player positions are reset.

```typescript
room.onPositionsReset(() => {
  console.log("Positions have been reset");
});
```

---

### Scoring Events

#### `onTeamGoal(callback: (team: TeamID) => void): void`

Triggered when a team scores a goal.

```typescript
room.onTeamGoal((team) => {
  console.log(`${team} team scored!`);
});
```

#### `onTeamVictory(callback: (scores: Scores) => void): void`

Triggered when a team wins the match.

```typescript
room.onTeamVictory((scores) => {
  console.log(`Match over! Red: ${scores.red}, Blue: ${scores.blue}`);
});
```

---

### Room Events

#### `onStadiumChange(callback: (stadiumName: string, byPlayer: Player | null) => void): void`

Triggered when the stadium is changed.

```typescript
room.onStadiumChange((stadiumName, byPlayer) => {
  console.log(`Stadium changed to ${stadiumName}`);
});
```

#### `onTeamsLockChange(callback: (locked: boolean, byPlayer: Player | null) => void): void`

Triggered when teams lock status changes.

```typescript
room.onTeamsLockChange((locked, byPlayer) => {
  const status = locked ? "locked" : "unlocked";
  console.log(`Teams are now ${status}`);
});
```

#### `onKickRateLimitSet(callback: (min: number, rate: number, burst: number, byPlayer: Player | null) => void): void`

Triggered when kick rate limit is changed.

```typescript
room.onKickRateLimitSet((min, rate, burst, byPlayer) => {
  console.log(`Kick rate limit: min=${min}, rate=${rate}, burst=${burst}`);
});
```

#### `onRoomDeath(callback: () => void): void`

Triggered when the room closes or crashes.

```typescript
room.onRoomDeath(() => {
  console.log("The room has been closed");
  process.exit(0);
});
```

---

## 🫩Other guides

- [Haxball models](./haxball-models.md)
- [Observability](./observability.md)
- [Setup sdk config](./setup-sdk-config.md)
- [First steps](./first-steps.md)