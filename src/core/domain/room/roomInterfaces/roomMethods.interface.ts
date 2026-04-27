import { Player, TeamID, Scores, Position, DiscProperties } from "../../typed";

export interface RoomMethods {

  /* ===== Communication ===== */

  /**
   * **RoomMethods** to send a chat message.
   * 
   * * `message` - The message to send.
   * * `targetId` - The ID of the player to send the message to. If not specified, the message is sent to all players.
   * 
   */
  sendChat(message: string, targetId?: number): Promise<void>;

  /**
   * **RoomMethods** to send an announcement.
   * 
   * * `message` - The message to send.
   * * `targetId` - The ID of the player to send the announcement to. If not specified, the announcement is sent to all players.
   * * `color` - (0xFF0000 is red, 0x00FF00 is green, 0x0000FF is blue).
   * * `style` - "normal","bold","italic", "small", "small-bold", "small-italic"
   * * `sound` - If sound is set to 0 the announcement will produce no sound. If sound is set to 1 the announcement will produce a normal chat sound. If set to 2 it will produce a notification sound.
   * 
   */
  sendAnnouncement(
    message: string,
    targetId?: number,
    color?: number,
    style?: number,
    sound?: number
  ): Promise<void>;

  /* ===== Player Management ===== */

  /**
   * **RoomMethods** to set a player as admin.
   * 
   * * `playerId` - The ID of the player to set as admin.
   * * `admin` - Whether the player should be admin or not.
   * 
   */
  setPlayerAdmin(playerId: number, admin: boolean): Promise<void>;

  /**
   * **RoomMethods** to set a player's team.
   * 
   * * `playerId` - The ID of the player to set the team for.
   * * `team` - The team to set for the player [0: Spectators, 1: Red, 2: Blue].
   * 
   */
  setPlayerTeam(playerId: number, team: TeamID): Promise<void>;

  /**
   * **RoomMethods** to kick a player from the room.
   * 
   * * `playerId` - The ID of the player to kick.
   * * `reason` - The reason for kicking the player.
   * * `ban` - Whether the player should be banned after being kicked.
   * 
   */
  kickPlayer(playerId: number, reason: string, ban: boolean): Promise<void>;

  /**
   * **RoomMethods** to clear a player's ban.
   * 
   * * `playerId` - The ID of the player to clear the ban for.
   * 
   */
  clearBan(playerId: number): Promise<void>;

  /**
   * **RoomMethods** to clear all player's bans.
   * 
   */
  clearBans(): Promise<void>;

  /**
   * **RoomMethods** to set a player's avatar.
   * 
   * * `playerId` - The ID of the player to set the avatar for.
   * * `avatar` - Define a player's "icon" or avatar, for example an emoji, number, or letters.
   * * `maxLength` - is two characters.
   * 
   * **example avatar** "09" or emoji
   * 
   */
  setPlayerAvatar(playerId: number, avatar: string): Promise<void>;

  /**
   * **RoomMethods** to reorder players in the room.
   * 
   * * `playerIds` - The list of player IDs to reorder.
   * * `moveToTop` - Whether to move the players to the top of the list.
   * 
   */
  reorderPlayers(playerIds: number[], moveToTop: boolean): Promise<void>;

  /* ===== Room Settings ===== */

  /**
   * **RoomMethods** to set the score limit.
   * 
   * * `limit` - The score limit to set.
   * 
   */
  
  /**
   * **RoomMethods** to set the score limit.
   * 
   * * `limit` - The score limit to set.
   * 
   */
  setScoreLimit(limit: number): Promise<void>;

  /**
   * **RoomMethods** to set the time limit.
   * 
   * * `limitInMinutes` - The time limit to set in minutes.
   * 
   */
  
  setTimeLimit(limitInMinutes: number): Promise<void>;

  /**
   * **RoomMethods** to set the password.
   * 
   * * `password` - The password to set, or `null` to remove the password.
   * 
   */
  
  setPassword(password: string | null): Promise<void>;

  /**
   * **RoomMethods** to set the require recaptcha.
   * 
   * * `enabled` - Whether to require recaptcha.
   * 
   */
  
  setRequireRecaptcha(enabled: boolean): Promise<void>;

  /**
   * **RoomMethods** to set the teams lock.
   * 
   * * `locked` - Whether to lock the teams.
   * 
   */
  setTeamsLock(locked: boolean): Promise<void>;

  /**
   * **RoomMethods** to set the team colors.
   * 
   * * `team` - The team to set the colors for.
   * * `angle` - The angle of the colors.
   * * `textColor` - The text color.
   * * `colors` - The colors to set.
   * 
   * **example color** 0xFF0000
   * 
   */
  setTeamColors(
    team: TeamID,
    angle: number,
    textColor: number,
    colors: number[]
  ): Promise<void>;

  /**
   * **RoomMethods** to set the kick rate limit.
   * 
   * * `min` - The minimum number of kicks.
   * * `rate` - The rate of kicks.
   * * `burst` - The burst of kicks.
   * 
   */  
  setKickRateLimit(min: number, rate: number, burst: number): Promise<void>;

  /* ===== Stadium ===== */

  /**
   * **RoomMethods** to set the default stadium.
   * 
   * * `name` - The name of the stadium.
   * 
   * **example name** `Big` , `Small` , `Huge`
   * 
   */
  
  setDefaultStadium(name: string): Promise<void>;

  /**
   * **RoomMethods** to set a custom stadium.
   * 
   * * `hbs` - The HBS string of the stadium.
   * 
   */
  setCustomStadium(hbs: string): Promise<void>;

  /* ===== Game Control ===== */

  /**
   * **RoomMethods** to get the room link.
   * 
   */
  getRoomLink(): Promise<string | null>;

  /**
   * **RoomMethods** to start the game.
   * 
   */
  
  startGame(): Promise<void>;

  /**
   * **RoomMethods** to stop the game.
   * 
   */
  stopGame(): Promise<void>;

  /**
   * **RoomMethods** to pause the game.
   * 
   * * `pauseState` - The state to set the game to.
   * 
   */
  pauseGame(pauseState: boolean): Promise<void>;

  /* ===== Game State ===== */

  /**
   * **RoomMethods** to get a player by their ID.
   * 
   * * `playerId` - The ID of the player.
   * 
   */
  getPlayer(playerId: number): Promise<Player | null>;

  /**
   * **RoomMethods** to get the player list.
   * 
   */
  getPlayerList(): Promise<Player[]>;

  /**
   * **RoomMethods** to get the scores.
   * 
   */
  getScores(): Promise<Scores | null>;

  /**
   * **RoomMethods** to get the ball position.
   * 
   */
  getBallPosition(): Promise<Position | null>;

  /* ===== Replay ===== */

  /**
   * **RoomMethods** to start recording.
   * 
   */
  startRecording(): Promise<void>;

  /**
   * **RoomMethods** to stop recording.
   * 
   * @returns A `Uint8Array` containing the replay data.
   * 
   */
  stopRecording(): Promise<Uint8Array>;

  /* ===== Physics ===== */

  /**
   * **RoomMethods** to set disc properties.
   * 
   * * `discIndex` - The index of the disc.
   * * `properties` - The properties to set.
   * 
   */
  setDiscProperties(discIndex: number, properties: DiscProperties): Promise<void>;

  /**
   * **RoomMethods** to get disc properties.
   * 
   * * `discIndex` - The index of the disc.
   * 
   */
  getDiscProperties(discIndex: number): Promise<DiscProperties>;

  /**
   * **RoomMethods** to set player disc properties.
   * 
   * * `playerId` - The ID of the player.
   * * `properties` - The properties to set.
   * 
   */
  setPlayerDiscProperties(playerId: number, properties: DiscProperties): Promise<void>;

  /**
   * **RoomMethods** to get player disc properties.
   * 
   * * `playerId` - The ID of the player.
   * 
   */
  getPlayerDiscProperties(playerId: number): Promise<DiscProperties>;

  /**
   * **RoomMethods** to get the disc count.
   * 
   */
  getDiscCount(): Promise<number>;
  
}
