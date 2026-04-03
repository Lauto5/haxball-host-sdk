import { IBox } from "./box.interface";
import { IRoomExecutor } from "./roomExecutor.interface";

export class Box implements IBox {
  constructor(
    private readonly id: string,
    private readonly executor: IRoomExecutor,
  ) {}

  async execute(method: string, args: unknown[]): Promise<unknown> {
    return this.executor.execute(this.id,method, args);
  }
}