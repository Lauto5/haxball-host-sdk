export interface IRoomExecutor {
  execute(boxId: string, method: string, args: unknown[]): Promise<unknown>;
}