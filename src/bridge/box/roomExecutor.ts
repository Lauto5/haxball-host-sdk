
import { IRoomExecutor } from "./roomExecutor.interface";
import { IRuntime } from "../runtime";

export class RoomExecutor implements IRoomExecutor {
  constructor(
    private readonly runtime: IRuntime,
    private readonly pageId: string,
  ) {}

  execute(method: string, args: unknown[]): Promise<unknown> {
    return this.runtime.execute(this.pageId, method, args as any[]);
  }
}