import { ILogger } from "../../../logger";
import { RoomConfig } from "../../../types/haxball";
import { BrowserResponse } from "../responses/browserResponse.interface";

export interface IRuntime {
  launchPage(
    rootLoger: ILogger,
    pageId: string,
    url: string,
    config: RoomConfig,
  ): Promise<void>;

  execute(pageId: string, method: string, args?: any[]): Promise<BrowserResponse>;

  on(callback:(data: BrowserResponse) => void): void;

  closePage(pageId: string): Promise<void>;
  
  close(): Promise<void>;


}
