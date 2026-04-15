

import { RoomMethods, RoomEvents } from "./roomInterfaces";

export interface Room extends RoomMethods, RoomEvents {
  id: string;
}
