export { };
import { RoomConfig } from "../../../types/haxball";


export namespace headless {
  export interface Window{
    __headless: headless.Environment;
  }
  
  export interface Environment{
    room: any;
    init(config:RoomConfig): void;
    exec(method: string, args: any[]): any;
  }
  
}