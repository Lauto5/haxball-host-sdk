import { ILogger } from "../../../logger";
import { RoomConfig } from "../../../types/haxball";
import { Response } from "../responses/eventResponse.interface";

export interface IRuntime {
  launchPage(
    rootLoger: ILogger,
    pageId: string,
    url: string,
    config: RoomConfig,
  ): Promise<void>;

  execute(pageId: string, method: string, args?: any[]): Promise<any>;

  on(callback:(data: Response) => void): void;

  closePage(pageId: string): Promise<void>;


}
