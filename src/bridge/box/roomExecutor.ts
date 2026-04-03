
import { IRoomExecutor } from "./roomExecutor.interface";
import { IRuntime } from "../runtime";

export class RoomExecutor implements IRoomExecutor {
  
  private runtime?: IRuntime;

  inject(runtime: IRuntime) {
    
    this.runtime = runtime;
    
  }
  
  execute(id: string, method: string, args: unknown[]): Promise<unknown> {

    if (!this.runtime) throw new Error("Runtime not injected");
    
    return this.runtime.execute(id, method, args as any[]);
  }
}