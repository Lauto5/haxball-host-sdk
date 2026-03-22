import { RoomConfig } from "../../../types/haxball";

export class HostEnvironmentBuilder {
  
  build() {
    
    return () => {
      
      (window as any).__headless = {
        
        room: null,

        async waitForRoom(room: any, timeout = 8000): Promise<any> {
          
          return new Promise((resolve, reject) => {
            
            let finished = false;

            room.onRoomLink = function (link: any) {
              
              finished = true;
              
              resolve(link);
              
            };

            setTimeout(() => {
              
              if (!finished) {
                
                reject(new Error("Token is invalid"));
                
              }
            }, timeout);
          });
        },

        async init(config: RoomConfig) {
          
          if (this.room !== null) {
            
            throw new Error("Room already initialized");
            
          }
          
          console.log("initializing the room ", config.roomName);
          
          this.room = (window as any).HBInit(config);

          try {
            
            const link = await this.waitForRoom(this.room);
            
            return { success: true, link: link };
            
          } catch (error) {
            
            return { success: false };
            
          }
        },

        exec(method: string, args: any[]): any {
          
          if (!this.room) throw new Error("Room not initialized");
          
          const fn = this.room[method];
          
          if (typeof fn !== "function") {
            
            throw new Error(method + "not found");
            
          }
          
          return fn(...args);
          
        },

        subscribeEvents(): void {
          
          if (!this.room) throw new Error("Room not initialized");

          this.room.onPlayerJoin = (player: any) => {
            
            this.emitEvent("onPlayerJoin", player);
            
          };

          this.room.onRoomLink = (link: string) => {
            
            this.emitEvent("onRoomLink", link);
            
          };
        },

        emitEvent(method: string, response: any[]): void {
          
          if (typeof (window as any).emit === "function") {
            
            try {
              
              (window as any).emit({
                method: method,
                response: response,
              });
              
            } catch (error) {
              
              throw new Error("Error in emitEvent");
              
            }
          }
        },
      };
    };
  }
}
