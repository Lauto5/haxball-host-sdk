# 📜 Haxball Models

Welcome to the **Haxball Models** documentation. This guide is for learning about the contracts used in Haxball.

---

## Room

```typescript
interface Room extends RoomMethods, RoomEvents {
  /**
   * id is the room name, Haha!
   */
  id: string;
}
```

## RoomConfig

```typescript
export interface RoomConfig {
  roomName: string;
  
  /**
   * The name of the player who will join the room.
   * 
   * This variable defines the name that the host bot will have.
   * 
   * It will only be useful if the **noPlayer** variable is declared as false.
   * 
   * **default**: `undefined`
   */  
  playerName?: string;
  
  password?: string | null;
  maxPlayers: number;
  public: boolean;
  geo?: GeoLocation;
  
  /**
   * **IMPORTANT** 
   * This variable is obtained from the official haxball token page, 
   * necessary to create a haxball host.
   */
  token: string;
  
  /**
   * If this variable is declared as false, 
   * the host will have a bot inside the room.
   * 
   * **default**: `false`
   */
  noPlayer: boolean;
}
```

## Player

```typescript
interface Player {
  id: number;
  name: string;
  team: TeamID;
  admin: boolean;
  position: Position | null;
  auth: string | null;
  conn: string;
}
```

## Position

```typescript
interface Position {
  x: number;
  y: number;
}
```

## GeoLocation

```typescript
interface GeoLocation {
  code: string; // Example : "AR" , "US" , "BR" , etc...
  lat: number;
  lon: number;
}
```
## Scores

```typescript
interface Scores {
  red: number;
  blue: number;
  time: number;
  scoreLimit: number;
  timeLimit: number;
}
```

## TeamID

```typescript
type TeamID = 0 | 1 | 2; // 0: Spectators, 1: Red, 2: Blue
```

## DiscProperties

```typescript
interface DiscProperties {
  x?: number;
  y?: number;
  xspeed?: number;
  yspeed?: number;
  xgravity?: number;
  ygravity?: number;
  radius?: number;
  bCoeff?: number;
  invMass?: number;
  damping?: number;
  color?: number;
  cMask?: number;
  cGroup?: number;
}
```

## 📝Other guides

- [first steps](./first-steps.md)
- [Room API](./room-api.md)
- [observability](./observability.md)
