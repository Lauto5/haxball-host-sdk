import { RoomConfig } from "../../../types/haxball";

export class HostEnvironmentBuilder {
  build() {
    return () => {
      (window as any).__headless = {
        room: null,

        waitForRoom(room: any, timeout = 5000): Promise<any> {
          return new Promise((resolve, reject) => {
            let finished = false;

            room.onRoomLink = function (link: any) {
              finished = true;
              resolve(link);
            };

            setTimeout(() => {
              if (!finished) {
                reject("timeout");
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
            const link = await this.await(this.room);

            console.log("Room ", config.roomName, " initialized successfully");

            return { success: true, link };
          } catch (error) {
            console.log("Token invalid");
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
