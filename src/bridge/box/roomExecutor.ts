
import { IRoomExecutor } from "./roomExecutor.interface";
import { IRuntime } from "../runtime";

export class RoomExecutor implements IRoomExecutor {
  constructor(
    private readonly runtime: IRuntime
  ) {}

  execute(id: string, method: string, args: unknown[]): Promise<unknown> {
    return this.runtime.execute(id, method, args as any[]);
  }
}