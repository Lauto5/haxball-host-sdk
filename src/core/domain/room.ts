import { RoomExecutor } from "../safe";
import { RoomMethods } from "./roomInterfaces/roomMethods.interface";
import { Player } from "./typed/player.interface";
import { TeamID } from "./typed/teamId.interface";
import { Scores } from "./typed/scores.interface";
import { Position } from "./typed/position.interface";
import { DiscProperties } from "./typed/discProperties.interface";


export class Room implements RoomMethods {
  
  public readonly id: string;

  private readonly executor: RoomExecutor;
  
  constructor(id: string, executor: RoomExecutor){
    this.id = id;
    this.executor = executor;
  }
  
  private async execute<T = any>(method: string, args: any[]): Promise<T> {
    return this.executor.execute<T>(method, args);
  }

  // Methods:
  
  sendChat(message: string, targetId?: number): Promise<void>{
    return this.execute<void>("sendChat", [message, targetId]);
  }

  sendAnnouncement(
    message: string,
    targetId?: number,
    color?: number,
    style?: number,
    sound?: number
  ): Promise<void>{
    return this.execute<void>("sendAnnouncement", [message, targetId, color, style, sound]);
  }

  setPlayerAdmin(playerId: number, admin: boolean): Promise<void>{
    return this.execute<void>("setPlayerAdmin", [playerId, admin]);
  }

  setPlayerTeam(playerId: number, team: TeamID): Promise<void>{
    return this.execute<void>("setPlayerTeam", [playerId, team]);
  }

  kickPlayer(playerId: number, reason: string, ban: boolean): Promise<void>{
    return this.execute<void>("kickPlayer", [playerId, reason, ban]);
  }

  clearBan(playerId: number): Promise<void>{
    return this.execute<void>("clearBan", [playerId]);
  }

  clearBans(): Promise<void>{
    return this.execute<void>("clearBans", []);
  }

  setPlayerAvatar(playerId: number, avatar: string): Promise<void>{
    return this.execute<void>("setPlayerAvatar", [playerId, avatar]);
  }

  reorderPlayers(playerIds: number[], moveToTop: boolean): Promise<void>{
    return this.execute<void>("reorderPlayers", [playerIds, moveToTop]);
  }

  setScoreLimit(limit: number): Promise<void>{
    return this.execute<void>("setScoreLimit", [limit]);
  }

  setTimeLimit(limitInMinutes: number): Promise<void>{
    return this.execute<void>("setTimeLimit", [limitInMinutes]);
  }

  setPassword(password: string | null): Promise<void>{
    return this.execute<void>("setPassword", [password]);
  }

  setRequireRecaptcha(enabled: boolean): Promise<void>{
    return this.execute<void>("setRequireRecaptcha", [enabled]);
  }

  setTeamsLock(locked: boolean): Promise<void>{
    return this.execute<void>("setTeamsLock", [locked]);
  }

  setTeamColors(
    team: TeamID,
    angle: number,
    textColor: number,
    colors: number[]
  ): Promise<void>{
    return this.execute<void>("setTeamColors", [team, angle, textColor, colors]);
  }

  setKickRateLimit(min: number, rate: number, burst: number): Promise<void>{
    return this.execute<void>("setKickRateLimit", [min, rate, burst]);
  }


  setDefaultStadium(name: string): Promise<void>{
    return this.execute<void>("setDefaultStadium", [name]);
  }

  setCustomStadium(hbs: string): Promise<void>{
    return this.execute<void>("setCustomStadium", [hbs]);
  }


  startGame(): Promise<void>{
    return this.execute<void>("startGame", []);
  }

  stopGame(): Promise<void>{
    return this.execute<void>("stopGame", []);
  }

  pauseGame(pauseState: boolean): Promise<void>{
    return this.execute<void>("pauseGame", [pauseState]);
  }

  getPlayer(playerId: number): Promise<Player | null>{
    return this.execute<Player | null>("getPlayer", [playerId]);
  }

  getPlayerList(): Promise<Player[]>{
    return this.execute<Player[]>("getPlayerList", []);
  }

  getScores(): Promise<Scores | null>{
    return this.execute<Scores | null>("getScores", []);
  }

  getBallPosition(): Promise<Position | null>{
    return this.execute<Position | null>("getBallPosition", []);
  }

  startRecording(): Promise<void>{
    return this.execute<void>("startRecording", []);
  }

  stopRecording(): Promise<Uint8Array>{
    return this.execute<Uint8Array>("stopRecording", []);
  }


  setDiscProperties(discIndex: number, properties: DiscProperties): Promise<void>{
    return this.execute<void>("setDiscProperties", [discIndex, properties]);
  }

  getDiscProperties(discIndex: number): Promise<DiscProperties>{
    return this.execute<DiscProperties>("getDiscProperties", [discIndex]);
  }

  setPlayerDiscProperties(playerId: number, properties: DiscProperties): Promise<void>{
    return this.execute<void>("setPlayerDiscProperties", [playerId, properties]);
  }

  getPlayerDiscProperties(playerId: number): Promise<DiscProperties>{
    return this.execute<DiscProperties>("getPlayerDiscProperties", [playerId]);
  }

  getDiscCount(): Promise<number>{
    return this.execute<number>("getDiscCount", []);
  }
}