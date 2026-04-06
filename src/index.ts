import { HaxballHostSDK } from "./core/haxball_host_sdk";

import { IMetrics } from "./observability";


import * as fs from "fs";
import * as path from "path";

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


const hbh:HaxballHostSDK = new HaxballHostSDK({
  metrics: new MyTestMetrics(),
});

// (desarrollo) probar el bridge, luego borrar.
hbh.testBridge().catch(console.error);