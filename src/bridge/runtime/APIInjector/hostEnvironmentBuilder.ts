import { RoomConfig } from "../../../types/haxball";

export class HostEnvironmentBuilder {
  build() { 
    return () => {
      (window as any).__headless = {
        room: null,
        
        
        init(config: RoomConfig): void{
          try {
            if (this.room !== null) {
              throw new Error("Room already initialized");
            }
            console.log("initializing the room ", config.roomName);
            this.room = (window as any).HBInit(config);
            console.log("Room ", config.roomName, " initialized successfully");
          } catch (e) {
            throw e;
          }
            
        },
        
        
        exec(method: string, args: any[]): any{
          if (!this.room) throw new Error("Room not initialized");
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