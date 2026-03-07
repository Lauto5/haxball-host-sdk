import { ILogger } from "../../../logger";
import { RoomConfig } from "../../../types/haxball";

export interface IRuntime {
    launchPage(rootLoger:ILogger,pageId: string , url:string, config:RoomConfig): Promise<void>;
    closePage(pageId:string): Promise<void>;
}