import { EventResponse } from "../runtime/events/eventResponse.interface";

export interface EventBridge {
  emitEvent(data: EventResponse): void;
}