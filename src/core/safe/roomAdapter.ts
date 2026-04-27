import { BrowserResponse } from "../bridge";
import { RoomProvider } from "../domain/room/roomProvider";

export class RoomAdapter {

  constructor(
    private room: RoomProvider,
    private roomId: string
  ) {}

  handleEvent(data: BrowserResponse) {

    if (data.id !== this.roomId) return;

    switch (data.method) {

      case "onPlayerJoin":
        this.room.emit("playerJoin", data.response);
        break;

      case "onPlayerLeave":
        this.room.emit("playerLeave", data.response);
        break;

      case "onPlayerChat":
        this.room.emit("playerChat", data.response[0], data.response[1]);
        break;

      case "onPlayerCommand":
        this.room.emit("playerCommand", data.response[0], data.response[1]);
        break;

      case "onGameStart":
        this.room.emit("gameStart", data.response);
        break;

      case "onGameStop":
        this.room.emit("gameStop", data.response);
        break;

      case "onGameTick":
        this.room.emit("gameTick");
        break;

      case "onTeamGoal":
        this.room.emit("teamGoal", data.response);
        break;

        case "onPlayerActivity":
          this.room.emit("playerActivity", data.response);
          break;
        
        case "onGamePause":
          this.room.emit("gamePause", data.response);
          break;
        
        case "onGameUnpause":
          this.room.emit("gameUnpause", data.response);
          break;
        
        case "onPositionsReset":
          this.room.emit("positionsReset");
          break;
        
        case "onTeamVictory":
          this.room.emit("teamVictory", data.response);
          break;
        
        case "onPlayerAdminChange":
          this.room.emit("playerAdminChange", data.response[0], data.response[1]);
          break;
        
        case "onPlayerTeamChange":
          this.room.emit("playerTeamChange", data.response[0], data.response[1]);
          break;
        
        case "onPlayerKicked":
          this.room.emit("playerKicked", data.response[0], data.response[1], data.response[2], data.response[3]);
          break;
        
        case "onPlayerBallKick":
          this.room.emit("playerBallKick", data.response[0]);
          break;
        
        case "onStadiumChange":
          this.room.emit("stadiumChange", data.response[0], data.response[1]);
          break;
        
        case "onTeamsLockChange":
          this.room.emit("teamsLockChange", data.response[0], data.response[1]);
          break;
        
        case "onKickRateLimitSet":
          this.room.emit("kickRateLimitSet", data.response[0], data.response[1], data.response[2], data.response[3]);
          break;
          
        case "onRoomDeath":
          this.room.emit("roomDeath");
          break;

    }
  }
}