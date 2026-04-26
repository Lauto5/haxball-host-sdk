

import { RoomMethods, RoomEvents } from "./roomInterfaces";

/**
 * Room represents a Haxball room.
 * 
 * @interface
 * @extends roomMethods : {@link RoomMethods}
 * @extends roomEvents : {@link RoomEvents}
 */
export interface Room extends RoomMethods, RoomEvents {
  /**
   * id is the room name, Haha!
   */
  id: string;
}
