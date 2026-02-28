export type PendingEntry = {
  resolve: ((value: unknown) => void);
  reject: ((reason?: unknown) => void);
  timeout?: ReturnType<typeof setTimeout>;
};

export interface IRPCChannel {
    // para funciones normales setTimeLimit()
    call(method: string, params?: unknown[], timeoutMs?: number): Promise<any>;
    // registrar handlers para metodos RPC y eventos.
    registerHandler(method: string, handler: (params: unknown[]) => unknown | Promise<unknown>): void;
}