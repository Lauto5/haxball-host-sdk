import { Player, TeamID, Scores, Position, DiscProperties } from "../../typed";

export interface RoomMethods {

  /* ===== Communication ===== */

  sendChat(message: string, targetId?: number): Promise<void>;

  sendAnnouncement(
    message: string,
    targetId?: number,
    color?: number,
    style?: number,
    sound?: number
  ): Promise<void>;

  /* ===== Player Management ===== */

  setPlayerAdmin(playerId: number, admin: boolean): Promise<void>;

  setPlayerTeam(playerId: number, team: TeamID): Promise<void>;

  kickPlayer(playerId: number, reason: string, ban: boolean): Promise<void>;

  clearBan(playerId: number): Promise<void>;

  clearBans(): Promise<void>;

  setPlayerAvatar(playerId: number, avatar: string): Promise<void>;

  reorderPlayers(playerIds: number[], moveToTop: boolean): Promise<void>;

  /* ===== Room Settings ===== */

  setScoreLimit(limit: number): Promise<void>;

  setTimeLimit(limitInMinutes: number): Promise<void>;

  setPassword(password: string | null): Promise<void>;

  setRequireRecaptcha(enabled: boolean): Promise<void>;

  setTeamsLock(locked: boolean): Promise<void>;

  setTeamColors(
    team: TeamID,
    angle: number,
    textColor: number,
    colors: number[]
  ): Promise<void>;

  setKickRateLimit(min: number, rate: number, burst: number): Promise<void>;

  /* ===== Stadium ===== */

  setDefaultStadium(name: string): Promise<void>;

  setCustomStadium(hbs: string): Promise<void>;

  /* ===== Game Control ===== */

  startGame(): Promise<void>;

  stopGame(): Promise<void>;

  pauseGame(pauseState: boolean): Promise<void>;

  /* ===== Game State ===== */

  getPlayer(playerId: number): Promise<Player | null>;

  getPlayerList(): Promise<Player[]>;

  getScores(): Promise<Scores | null>;

  getBallPosition(): Promise<Position | null>;

  /* ===== Replay ===== */

  startRecording(): Promise<void>;

  stopRecording(): Promise<Uint8Array>;

  /* ===== Physics ===== */

  setDiscProperties(discIndex: number, properties: DiscProperties): Promise<void>;

  getDiscProperties(discIndex: number): Promise<DiscProperties>;

  setPlayerDiscProperties(playerId: number, properties: DiscProperties): Promise<void>;

  getPlayerDiscProperties(playerId: number): Promise<DiscProperties>;

  getDiscCount(): Promise<number>;
  
}
