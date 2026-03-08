import { RoomConfig } from "../../../types/haxball";

export class HostEnvironmentBuilder {
  build() {
    return () => {
      (window as any).__headless = {
        room: null,

        async waitForRoom(room: any, timeout = 10000): Promise<any> {
          return new Promise((resolve, reject) => {
            let finished = false;

            room.onRoomLink = function (link: any) {
              console.log("ON ROOM LINK");
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
            console.log(link);
            return { success: true, link: link };
            
          } catch (error) {
            return { success: false, error:error};
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

          this.room.onPlayerJoin = function (player: any) {
            this.emit("onPlayerJoin", player);
          };
        },

        emit(method: string, response: any[]): any {
          return { method: method, response: response };
        },
      };
    };
  }
}
