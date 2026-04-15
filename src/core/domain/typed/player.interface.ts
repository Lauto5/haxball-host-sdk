
import { TeamID } from "./teamId.interface";
import { Position } from "./position.interface";

export interface Player {
  id: number;
  name: string;
  team: TeamID;
  admin: boolean;
  position: Position | null;
  auth: string | null;
  conn: string;
}