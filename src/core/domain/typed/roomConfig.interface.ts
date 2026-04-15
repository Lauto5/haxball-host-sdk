
import { GeoLocation } from './geoLocation.interface';

export interface RoomConfig {
  roomName: string;
  playerName?: string;
  password?: string | null;
  maxPlayers: number;
  public: boolean;
  geo?: GeoLocation;
  token: string;
  noPlayer: boolean;
}