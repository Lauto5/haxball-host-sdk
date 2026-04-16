import { RoomExecutor } from "../../safe";
import { Player, TeamID, Scores, Position, DiscProperties } from "../typed";
import { EventEmitter } from "events";


import { Room } from "./room";


export class RoomProvider implements Room {
  
  public readonly id: string;

  private executor: RoomExecutor;
  
  private readonly emitter: EventEmitter = new EventEmitter();
  
  constructor(id: string, executor: RoomExecutor){
    this.id = id;
    this.executor = executor;
  }
  
  emit(event: string, ...args: any[]) {
    this.emitter.emit(event, ...args);
  }
  
  private async execute<T = any>(method: string, args: any[]): Promise<T> {
    return this.executor.execute<T>(method, args);
  }
  
  setExecutor(executor: RoomExecutor) {
    this.executor = executor;
  }
  
  

  /*
  
  METHODS
  
  */
  
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
  
  /*
 
    EVENTS
 
  */
  
  onPlayerJoin(callback: (player: Player) => void): void{
    this.emitter.on("playerJoin", callback);
  }
  
  onPlayerLeave(callback: (player: Player) => void): void {
    this.emitter.on("playerLeave", callback);
  }

  onPlayerChat(callback: (player: Player, message: string) => boolean | void): void {
    this.emitter.on("playerChat", callback);
  }
  
  onPlayerCommand(callback: (player: Player, message: string) => void): void {
    this.emitter.on("playerCommand", callback);
  }
  
  onPlayerActivity(callback: (player: Player) => void): void {
    this.emitter.on("playerActivity", callback);
  }
  
  onGameStart(callback: (byPlayer: Player | null) => void): void {
    this.emitter.on("gameStart", callback);
  }
  
  onGameStop(callback: (byPlayer: Player | null) => void): void {
    this.emitter.on("gameStop", callback);
  }
  
  onGameTick(callback: () => void): void {
    this.emitter.on("gameTick", callback);
  }
  
  onGamePause(callback: (byPlayer: Player | null) => void): void {
    this.emitter.on("gamePause", callback);
  }
  
  onGameUnpause(callback: (byPlayer: Player | null) => void): void {
    this.emitter.on("gameUnpause", callback);
  }
  
  onPositionsReset(callback: () => void): void {
    this.emitter.on("positionsReset", callback);
  }
  
  onTeamGoal(callback: (team: TeamID) => void): void {
    this.emitter.on("teamGoal", callback);
  }
  
  onTeamVictory(callback: (scores: Scores) => void): void {
    this.emitter.on("teamVictory", callback);
  }
  
  onPlayerAdminChange(callback: (changedPlayer: Player, byPlayer: Player | null) => void): void {
    this.emitter.on("playerAdminChange", callback);
  }
  
  onPlayerTeamChange(callback: (changedPlayer: Player, byPlayer: Player | null) => void): void {
    this.emitter.on("playerTeamChange", callback);
  }
  
  onPlayerKicked(
    callback: (kickedPlayer: Player, reason: string, ban: boolean, byPlayer: Player | null) => void
  ): void {
    this.emitter.on("playerKicked", callback);
  }
  
  onStadiumChange(callback: (stadiumName: string, byPlayer: Player | null) => void): void {
    this.emitter.on("stadiumChange", callback);
  }
  
  onRoomLink(callback: (url: string) => void): void {
    this.emitter.on("roomLink", callback);
  }
  
  onTeamsLockChange(callback: (locked: boolean, byPlayer: Player | null) => void): void {
    this.emitter.on("teamsLockChange", callback);
  }
  
  onKickRateLimitSet(
    callback: (min: number, rate: number, burst: number, byPlayer: Player | null) => void
  ): void {
    this.emitter.on("kickRateLimitSet", callback);
  }
  
  onRoomDeath(callback: () => void): void {
    this.emitter.on("roomDeath", callback);
  }
  
}