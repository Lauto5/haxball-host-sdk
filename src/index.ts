import { HaxballHostSDK } from "./core/haxball_host_sdk";
import { ObservabilityConfig } from "./config";
import { IMetrics } from "./core/observability";

import * as fs from "fs";
import * as path from "path";
import { RoomConfig } from "./core/domain";

// PRUEBA
// haciendo que las metricas se guarden en un archivo
class MyTestMetrics implements IMetrics {
  private filePath: string;

  constructor(fileName: string = "metrics.json") {
    this.filePath = path.resolve("./", fileName);
    // Inicializa el archivo si no existe
    
    // Si el archivo existe borrarlo y crear uno nuevo vacío
    
    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath);
    }
    
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), "utf-8");
    }
  }

  private writeEntry(
    type: "increment" | "gauge" | "observe",
    metric: string,
    value: number,
    tags?: Record<string, string>
  ): void {
    const raw = fs.readFileSync(this.filePath, "utf-8");
    const entries: object[] = JSON.parse(raw);

    entries.push({
      type,
      metric,
      value,
      tags: tags ?? {},
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(this.filePath, JSON.stringify(entries, null, 2), "utf-8");
  }

  increment(metric: string, value: number = 1, tags?: Record<string, string>): void {
    this.writeEntry("increment", metric, value, tags);
  }

  gauge(metric: string, value: number, tags?: Record<string, string>): void {
    this.writeEntry("gauge", metric, value, tags);
  }

  observe(metric: string, value: number, tags?: Record<string, string>): void {
    this.writeEntry("observe", metric, value, tags);
  }
}

const observabilityConfig: ObservabilityConfig = new ObservabilityConfig(3, undefined, new MyTestMetrics());

const hbh = new HaxballHostSDK();

const roomConfig: RoomConfig = {
  roomName: "Haxball-host-sdk-1",
  maxPlayers: 10,
  public: true,
  noPlayer: true,
  token: "thr1.AAAAAGngH8C_Z1iZoagUVQ.41qCQmFvdBs",
}

async function main() {
  
  const room = await hbh.createRoom(roomConfig);
  
  room.setDefaultStadium("Huge");
  
  room.onPlayerCommand(async (player, message) => {
    
    // obtener el comando !comando args1 args2
    const command: string = message.split(" ")[0];
    const args: string[] = message.split(" ").slice(1);
    
    console.log(`Player ${player.name} sent command: ${message} \n args: ${args}`);
    
    if (command === "!startGame") {
      room.startGame();
    }
    if (command === "!stopGame") {
      room.stopGame();
    }
    if (command === "!giveAdmin") {
      room.setPlayerAdmin(player.id, true);
    }
    if (command === "!takeAdmin") {
      room.setPlayerAdmin(player.id, false);
    }
    
    if (command === "!iceball") {
      // poner en modo ice ball:
      
      room.setDiscProperties(0, { color : 0x0000ff ,ygravity:  10 , xgravity: 10 , xspeed: 9 , yspeed: 9});
      
    }
    
    if (command === "!playerPosition") {
      room.setPlayerDiscProperties(player.id, { x: parseFloat(args[0]), y: parseFloat(args[1]) });
    }
    
    if (command === "!meColor") {
      if (args[0] === "red") {
        room.setPlayerDiscProperties(player.id, { color: 0xff0000 });
      } else if (args[0] === "blue") {
        room.setPlayerDiscProperties(player.id, { color: 0x0000ff });
      } else if (args[0] === "green") {
        room.setPlayerDiscProperties(player.id, { color: 0x00ff00 });
      }
    }
    
  });
  
}


main().catch(console.error);


// (desarrollo) probar el bridge, luego borrar.
// hbh.testBridge().catch(console.error);