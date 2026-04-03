export interface IRoomExecutor {
  execute(method: string, args: unknown[]): Promise<unknown>;
}