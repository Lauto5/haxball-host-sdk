import { RoomConfig } from "../../../types/haxball";
import {headless} from "../types/headless.types";

export class HostEnvironmentBuilder {
  build() { 
    return () => {
      (window as any).__headless = {
        room: null,
        
        
        init(config: RoomConfig): void{
          try {
            if (this.room !== null) {
              throw new Error("El room ya esta iniciado");
            }
         
            
            console.log("inicializando Room");
            
            this.room = (window as any).HBInit(config);
            
            console.log("el room es : ", this.room);
            
          } catch (e) {
            throw e;
          }
            
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