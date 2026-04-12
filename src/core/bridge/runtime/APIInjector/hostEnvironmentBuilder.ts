import { RoomConfig } from "../../../../types/haxball";

export class HostEnvironmentBuilder {

  build() {

    return () => {

      (window as any).__headless = {

        room: null,
        
        lastGameTick: Date.now(),
        
        isGameTickActive: false,

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

            return { success: true, message: "Room initialized successfully", data: link };

          } catch (error) {

            return { success: false, message: error instanceof Error ? error.message : String(error) };

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
          
          this.room.onGameTick = () => {

            this.lastGameTick = Date.now();
            
            this.emitEvent("onGameTick", []);

          };

          this.room.onPlayerJoin = (player: any) => {
            
            if (!this.isGameTickActive) {
              this.isGameTickActive = true;
            }

            this.emitEvent("onPlayerJoin", player);

          };

          this.room.onPlayerLeave = (player: any) => {

            this.emitEvent("onPlayerLeave", player);

          };

          this.room.onPlayerChat = (player: any, message: string) => {

            this.emitEvent("onPlayerChat", [player, message]);

          };

          this.room.onPlayerActivity = (player: any) => {

            this.emitEvent("onPlayerActivity", player);

          };

          this.room.onGameStart = (byPlayer: any) => {

            this.emitEvent("onGameStart", byPlayer);

          };

          this.room.onGameStop = (byPlayer: any) => {

            this.emitEvent("onGameStop", byPlayer);

          };

          this.room.onGamePause = (byPlayer: any) => {

            this.emitEvent("onGamePause", byPlayer);

          };

          this.room.onGameUnpause = (byPlayer: any) => {

            this.emitEvent("onGameUnpause", byPlayer);

          };

          this.room.onPositionsReset = () => {

            this.emitEvent("onPositionsReset", []);

          };

          this.room.onTeamGoal = (team: any) => {

            this.emitEvent("onTeamGoal", team);

          };

          this.room.onTeamVictory = (scores: any) => {

            this.emitEvent("onTeamVictory", scores);

          };

          this.room.onPlayerAdminChange = (changedPlayer: any, byPlayer: any) => {

            this.emitEvent("onPlayerAdminChange", [changedPlayer, byPlayer]);

          };

          this.room.onPlayerTeamChange = (changedPlayer: any, byPlayer: any) => {

            this.emitEvent("onPlayerTeamChange", [changedPlayer, byPlayer]);

          };

          this.room.onPlayerKicked = (kickedPlayer: any, reason: string, ban: boolean, byPlayer: any) => {

            this.emitEvent("onPlayerKicked", [kickedPlayer, reason, ban, byPlayer]);

          };

          this.room.onStadiumChange = (stadiumName: string, byPlayer: any) => {

            this.emitEvent("onStadiumChange", [stadiumName, byPlayer]);

          };

          this.room.onRoomLink = (link: string) => {

            this.emitEvent("onRoomLink", link);

          };

          this.room.onTeamsLockChange = (locked: boolean, byPlayer: any) => {

            this.emitEvent("onTeamsLockChange", [locked, byPlayer]);

          };

          this.room.onKickRateLimitSet = (min: number, rate: number, burst: number, byPlayer: any) => {

            this.emitEvent("onKickRateLimitSet", [min, rate, burst, byPlayer]);

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
        
        isAlive(): boolean {
          if (!this.isGameTickActive) {
            return true;
          }
          return Date.now() - this.lastGameTick < 6000;
        },
        
      };
    };
  }
}
