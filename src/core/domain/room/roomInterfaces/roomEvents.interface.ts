

import { Player, TeamID, Scores } from "../../typed";

export interface RoomEvents {
  
  /**
   * **RoomEvents** when a player enters the room.
   */
  onPlayerJoin(callback: (player: Player) => void): void;
  
  /**
   * **RoomEvents** when a player leaves the room.
   */
  onPlayerLeave(callback: (player: Player) => void): void;

  /**
   * **RoomEvents** when a player sends a chat message.
   */
  onPlayerChat(callback: (player: Player, message: string) => boolean | void): void;
  
  /**
   * **RoomEvents** when a player sends a command.
   * 
   * **IMPORTANT** Chat commands are defined with "!" at the beginning of the message.
   * 
   * You must define the commands yourself, always keeping in mind that they begin with "!".
   * 
   * **example** `!kick <playerId>`
   * 
   * **example2** `!help`
   * 
   */
  onPlayerCommand(callback: (player: Player, message: string) => void): void;
  
  /**
   * **RoomEvents** when a player gives signs of activity, such as pressing a key.
   * This is useful for detecting inactive players.
   */
  onPlayerActivity(callback: (player: Player) => void): void;
  
  /**
   * **RoomEvents** when a player kicks the ball.
   */
  
  onPlayerBallKick(callback: (player: Player) => void): void;

  /**
   * **RoomEvents** when the game starts.
   */  
  onGameStart(callback: (byPlayer: Player | null) => void): void;

  /**
   * **RoomEvents** when the game stops.
   */
  onGameStop(callback: (byPlayer: Player | null) => void): void;

  /**
   * **RoomEvents** when the game ticks.
   */
  onGameTick(callback: () => void): void;

  /**
   * **RoomEvents** when the game pauses.
   */
  onGamePause(callback: (byPlayer: Player | null) => void): void;

  /**
   * **RoomEvents** when the game unpauses.
   */
  onGameUnpause(callback: (byPlayer: Player | null) => void): void;

  /**
   * **RoomEvents** when the positions are reset.
   */
  onPositionsReset(callback: () => void): void;

  /**
   * **RoomEvents** when a team scores a goal.
   */
  onTeamGoal(callback: (team: TeamID) => void): void;

  /**
   * **RoomEvents** when a team wins the game.
   */
  onTeamVictory(callback: (scores: Scores) => void): void;

  /**
   * **RoomEvents** when a player is promoted to admin.
   */
  onPlayerAdminChange(callback: (changedPlayer: Player, byPlayer: Player | null) => void): void;

  /**
   * **RoomEvents** when a player changes team.
   */
  onPlayerTeamChange(callback: (changedPlayer: Player, byPlayer: Player | null) => void): void;

  /**
   * **RoomEvents** when a player is kicked.
   */
  onPlayerKicked(
    callback: (kickedPlayer: Player, reason: string, ban: boolean, byPlayer: Player | null) => void
  ): void;
  
  /**
   * **RoomEvents** when the stadium changes.
   */
  onStadiumChange(callback: (stadiumName: string, byPlayer: Player | null) => void): void;

  /**
   * **RoomEvents** when the room link changes.
   */
  onRoomLink(callback: (url: string) => void): void;
  
  /**
   * **RoomEvents** when the teams lock changes.
   */
  onTeamsLockChange(callback: (locked: boolean, byPlayer: Player | null) => void): void;

  /**
   * **RoomEvents** when the kick rate limit is set.
   */
  onKickRateLimitSet(
    callback: (min: number, rate: number, burst: number, byPlayer: Player | null) => void
  ): void;

  /**
   * **RoomEvents** when the room dies.
   */
  onRoomDeath(callback: () => void): void;
  
}