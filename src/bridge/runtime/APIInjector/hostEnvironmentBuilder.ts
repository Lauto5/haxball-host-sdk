import { RoomConfig } from "../../../types/haxball";
import {headless} from "../types/headless.types";

export class HostEnvironmentBuilder {
  build() { 
    return () => {
      (window as any).__headless = {
        room: null,
        init(config: RoomConfig): void{
          try {
            if (this.room === null) {
              throw new Error("El room ya esta iniciado");
            }
            if ((window as any).HBInit !== "funtion") {
              throw new Error("El HBInit() no existe.");
            }
          }catch(e){}
            
        },
        exec(method: string, args: any[]): any{
          
        }
      }
    }
  }
}