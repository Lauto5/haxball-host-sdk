
import { TeamID } from "./teamId.interface";
import { Position } from "./position.interface";

/**
 * Player is an interface that defines the properties of a player in the game.
 */
export interface Player {
  id: number;
  name: string;
  team: TeamID;
  admin: boolean;
  position: Position | null;
  auth: string | null;
  conn: string;
}