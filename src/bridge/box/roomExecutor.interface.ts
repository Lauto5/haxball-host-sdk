import { IRuntime } from "../runtime";

export interface IRoomExecutor {

  inject(runtime: IRuntime): void;
  
  execute(boxId: string, method: string, args: unknown[]): Promise<unknown>;
}