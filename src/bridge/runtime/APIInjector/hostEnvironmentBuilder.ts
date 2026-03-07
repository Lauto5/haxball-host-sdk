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
            
            this.room = (window as any).HBInit(config);
            
          }catch(e){}
            
        },
        exec(method: string, args: any[]): any{
          if (!this.room) throw new Error("room not initialized");
          const fn = this.room[method];
          if (typeof fn !== "function") {
              throw new Error(method + "not found");
          }
          return fn(...args);
        }
      }
    }
  }
}