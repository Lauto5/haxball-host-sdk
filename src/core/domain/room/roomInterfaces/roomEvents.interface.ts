

import { Player, TeamID, Scores } from "../../typed";

export interface RoomEvents {
  
  onPlayerJoin(callback: (player: Player) => void): void;
  
  onPlayerLeave(callback: (player: Player) => void): void;

  onPlayerChat(callback: (player: Player, message: string) => boolean | void): void;
  
  onPlayerCommand(callback: (player: Player, message: string) => void): void;
  
  onPlayerActivity(callback: (player: Player) => void): void;
  
  onGameStart(callback: (byPlayer: Player | null) => void): void;
  
  onGameStop(callback: (byPlayer: Player | null) => void): void;
  
  onGameTick(callback: () => void): void;
  
  onGamePause(callback: (byPlayer: Player | null) => void): void;
  
  onGameUnpause(callback: (byPlayer: Player | null) => void): void;
  
  onPositionsReset(callback: () => void): void;
  
  onTeamGoal(callback: (team: TeamID) => void): void;
  
  onTeamVictory(callback: (scores: Scores) => void): void;
  
  onPlayerAdminChange(callback: (changedPlayer: Player, byPlayer: Player | null) => void): void;
  
  onPlayerTeamChange(callback: (changedPlayer: Player, byPlayer: Player | null) => void): void;
  
  onPlayerKicked(
    callback: (kickedPlayer: Player, reason: string, ban: boolean, byPlayer: Player | null) => void
  ): void;
  
  onStadiumChange(callback: (stadiumName: string, byPlayer: Player | null) => void): void;
  
  onRoomLink(callback: (url: string) => void): void;
  
  onTeamsLockChange(callback: (locked: boolean, byPlayer: Player | null) => void): void;
  
  onKickRateLimitSet(
    callback: (min: number, rate: number, burst: number, byPlayer: Player | null) => void
  ): void;
  
  onRoomDeath(callback: () => void): void;
  
}