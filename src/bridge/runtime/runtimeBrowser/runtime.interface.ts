import { ILogger } from "../../../logger";
import { RoomConfig } from "../../../types/haxball";
import { EventResponse } from "../responses/eventResponse.interface";

export interface IRuntime {
  launchPage(
    rootLoger: ILogger,
    pageId: string,
    url: string,
    config: RoomConfig,
  ): Promise<void>;

  execute(pageId: string, method: string, args?: any[]): Promise<any>;

  on(callback:(data: EventResponse) => void): void;

  closePage(pageId: string): Promise<void>;
  
  close(): Promise<void>;


}
