
import { GeoLocation } from './geoLocation.interface';

/**
 * RoomConfig is an interface that defines the configuration of a room in the game.
 * 
 * use to create a room configuration for creating a room.
 * 
 * **use in Haxball-Host (class)**
 * 
 * ```typescript
 * const roomConfig: RoomConfig = {
 *   roomName: 'My Room',
 *   playerName: 'Player 1',
 *   password: null,
 *   maxPlayers: 10,
 *   public: true,
 *   geo: {
 *     latitude: 0,
 *     longitude: 0,
 *   },
 *   token: '',
 *   noPlayer: false,
 * };
 * ```
 */
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