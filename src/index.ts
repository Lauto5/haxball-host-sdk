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

const hbh = new HaxballHostSDK(observabilityConfig);

const roomConfig: RoomConfig = {
  roomName: "Haxball-host-sdk-1",
  maxPlayers: 10,
  public: true,
  noPlayer: true,
  token: "thr1.AAAAAGnfy6hFKA1OL5O-dg.a33vVHncdvI",
}

async function main() {
  
  const room = await hbh.createRoom(roomConfig);
  
  room.setDefaultStadium("Huge");
  
  room.onPlayerCommand((player, message) => {
    
    if ( message === "!startGame") {
      room.startGame();
    }
    if ( message === "!stopGame") {
      room.stopGame();
    }
    if (message === "!giveAdmin") {
      room.setPlayerAdmin(player.id, true);
    }
    if (message === "!takeAdmin") {
      room.setPlayerAdmin(player.id, false);
    }
    
  });
  
}


main().catch(console.error);


// (desarrollo) probar el bridge, luego borrar.
// hbh.testBridge().catch(console.error);