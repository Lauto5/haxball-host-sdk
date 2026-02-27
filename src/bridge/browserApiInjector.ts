import { EvaluationContext } from "./evaluationContext";

interface RoomConfig {
    roomName?: string;
    playerName: string;
    password: string;
    maxPlayers?: number;
    isPublic: boolean;
    geo?: Geo;
    token?: string;
    isNoPlayer: boolean;
}

interface Player {
    id: number;
    name: string;
    team: TeamId;
    isAdmin: boolean;
    position: { x: number; y: number };
    auth?: string;
    conn: string;
}

interface Scores {
    red: number;
    blue: number;
    time: number;
    scoreLimit: number;
    timeLimit: number;
}

interface DiscProperties {
    x: number;
    y: number;
    xspeed: number;
    yspeed: number;
    xgravity: number;
    ygravity: number;
    radius: number;
    bCoeff: number;
    invMass: number;
    damping: number;
    color: number;
    cMask: number;
    cGroup: number;
}

enum TeamId{
    red = 1,
    blue = 2,
    spectators = 0
}

interface Geo{
    code: string;
    lat: number;
    lon: number;   
}

/* aca definimos la interfaz del injector, el cual es el encargado en aplicar las
    reglas de haxball en el navegador, es decir traducir el mundo haxball en el mundo del navegador, 
    para que el juego pueda ser jugado en el navegador, 
    y tambien para que el juego pueda ser controlado desde el servidor, es decir,
    para que el servidor pueda enviar comandos al navegador para controlar el juego, 
    y para que el navegador pueda enviar eventos al servidor para informar sobre lo que esta pasando en el juego.
*/
interface IBrowserApiInjector {
    
    // metodo inicial.
    HBInit(config: RoomConfig): Promise<void>;

    // metodos de room.
    sendChat(message: string , targetId?: number): Promise<void>;

    setPlayerAdmin(playerId: number, isAdmin: boolean): Promise<void>;

    kickPlayer(playerId: number, reason: string , ban: boolean): Promise<void>;

    clearBan(playerId: number): Promise<void>;

    clearBans(): Promise<void>;

    setScoreLimit(limit: number): Promise<void>;

    setTimeLimit(limitInMinutes: number): Promise<void>;

    setCustomStadium(stadiumFileContents: string): Promise<void>;

    setDefaultStadium(stadiumName: string): Promise<void>;

    setTeamsLock(locked: boolean): Promise<void>;

    setTeamColors(team: TeamId , angle: number, textColor: number , colors: number[]): Promise<void>;

    startGame(): Promise<void>;

    stopGame(): Promise<void>;

    pauseGame(pauseState: boolean): Promise<void>;

    getPlayer(): Promise<Player>;
    
    getPlayers(): Promise<Player[]>;
    
    getScores(): Promise<Scores>;

    getBallPosition(): Promise<{ x: number; y: number }>;

    startRecording(): Promise<void>;

    stopRecording(): Promise<Uint8Array>;

    setPassword(pass: string): Promise<void>;

    setRequireRecaptcha(required: boolean): Promise<void>;

    recorderPlayers(playerIdList: number[] , moveToTop: boolean): Promise<void>;

    sendAnnouncement(msg: string, targetId?: number , color?: number , style?: string, sound?: number): Promise<void>;

    setKickRateLimit(min?: number, rate?: number, burst?: number): Promise<void>;

    setPlayerAvatar(playerId: number, avatar: string): Promise<void>;

    setDiscProperties(discIndex:number , properties: DiscProperties): Promise<void>;

    getDiscProperties(discIndex: number): Promise<DiscProperties>;

    setPlayerDiscProperties(playerId: number, properties: DiscProperties): Promise<void>;

    getPlayerDiscProperties(playerId: number): Promise<DiscProperties>;

    getDiscCount(): Promise<number>;

    // luego hacer correctamente los collision flags.
    //collisionFlag

    // eventos
    onPlayerJoin(callback: (player: Player) => void): void;

    onPlayerLeave(callback: (player: Player) => void): void;

    onTeamVictory(callback: (scores: Scores) => void): void;

    onPlayerChat(callback: (player: Player, message: string) => boolean | void): void;

    onPlayerBallKick(callback: (player: Player) => void): void;

    onTeamGoal(callback: (teamId: TeamId) => void): void;

    onGameStart(callback: (byPlayer: Player) => void): void;

    onGameStop(callback: (byPlayer: Player) => void): void;

    onGamePause(callback: (byPlayer: Player) => void): void;

    onPlayerAdminChange(callback: (changedPlayer: Player, byPlayer: Player)=> void): void;

    onPlayerTeamChange(callback: (changedPlayer: Player, byPlayer: Player)=> void): void;

    onPlayerKicked(callback: (kickedPlayer: Player, reason: string, ban: boolean, byPlayer: Player) => void): void;

    onGameTick(callback: () => void): void;

    onGamePause(callback: (byPlayer: Player) => void): void;

    onGameUnpause(callback: (byPlayer: Player) => void): void;

    onPositionsReset(callback: () => void): void;

    onPlayerActivity(callback: (player: Player) => void): void;

    onStadiumChange(callback: (newStadiumName: string, byPlayer: Player) => void): void;

    onRoomLink(callback: (url: string) => void): void;

    onKickrateLimitSet(callback: (min: number, rate: number, burst: number, byPlayer: Player) => void): void;

    onTeamsLockChange(callback: (locked: boolean, byPlayer: Player) => void): void;
}

class BrowserApiInjector implements IBrowserApiInjector {

    private pageId: string;
    private evaluationContext: EvaluationContext;

    constructor(pageId: string , evaluationContext: EvaluationContext) {
        this.pageId = pageId;
        this.evaluationContext = evaluationContext;
    }

    // aun sin implementar, solo para probar la estructura, luego implementar correctamente cada metodo.

    HBInit(config: RoomConfig): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendChat(message: string, targetId?: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setPlayerAdmin(playerId: number, isAdmin: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    kickPlayer(playerId: number, reason: string, ban: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    clearBan(playerId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    clearBans(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setScoreLimit(limit: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setTimeLimit(limitInMinutes: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setCustomStadium(stadiumFileContents: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setDefaultStadium(stadiumName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setTeamsLock(locked: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setTeamColors(team: TeamId, angle: number, textColor: number, colors: number[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    startGame(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    stopGame(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    pauseGame(pauseState: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getPlayer(): Promise<Player> {
        throw new Error("Method not implemented.");
    }
    getPlayers(): Promise<Player[]> {
        throw new Error("Method not implemented.");
    }
    getScores(): Promise<Scores> {
        throw new Error("Method not implemented.");
    }
    getBallPosition(): Promise<{ x: number; y: number; }> {
        throw new Error("Method not implemented.");
    }
    startRecording(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    stopRecording(): Promise<Uint8Array> {
        throw new Error("Method not implemented.");
    }
    setPassword(pass: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setRequireRecaptcha(required: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    recorderPlayers(playerIdList: number[], moveToTop: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendAnnouncement(msg: string, targetId?: number, color?: number, style?: string, sound?: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setKickRateLimit(min?: number, rate?: number, burst?: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setPlayerAvatar(playerId: number, avatar: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setDiscProperties(discIndex: number, properties: DiscProperties): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getDiscProperties(discIndex: number): Promise<DiscProperties> {
        throw new Error("Method not implemented.");
    }
    setPlayerDiscProperties(playerId: number, properties: DiscProperties): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getPlayerDiscProperties(playerId: number): Promise<DiscProperties> {
        throw new Error("Method not implemented.");
    }
    getDiscCount(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    onPlayerJoin(callback: (player: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onPlayerLeave(callback: (player: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onTeamVictory(callback: (scores: Scores) => void): void {
        throw new Error("Method not implemented.");
    }
    onPlayerChat(callback: (player: Player, message: string) => boolean | void): void {
        throw new Error("Method not implemented.");
    }
    onPlayerBallKick(callback: (player: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onTeamGoal(callback: (teamId: TeamId) => void): void {
        throw new Error("Method not implemented.");
    }
    onGameStart(callback: (byPlayer: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onGameStop(callback: (byPlayer: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onGamePause(callback: (byPlayer: Player) => void): void;
    onGamePause(callback: (byPlayer: Player) => void): void;
    onGamePause(callback: unknown): void {
        throw new Error("Method not implemented.");
    }
    onPlayerAdminChange(callback: (changedPlayer: Player, byPlayer: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onPlayerTeamChange(callback: (changedPlayer: Player, byPlayer: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onPlayerKicked(callback: (kickedPlayer: Player, reason: string, ban: boolean, byPlayer: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onGameTick(callback: () => void): void {
        throw new Error("Method not implemented.");
    }
    onGameUnpause(callback: (byPlayer: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onPositionsReset(callback: () => void): void {
        throw new Error("Method not implemented.");
    }
    onPlayerActivity(callback: (player: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onStadiumChange(callback: (newStadiumName: string, byPlayer: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onRoomLink(callback: (url: string) => void): void {
        throw new Error("Method not implemented.");
    }
    onKickrateLimitSet(callback: (min: number, rate: number, burst: number, byPlayer: Player) => void): void {
        throw new Error("Method not implemented.");
    }
    onTeamsLockChange(callback: (locked: boolean, byPlayer: Player) => void): void {
        throw new Error("Method not implemented.");
    }

}