
interface IRPCChannel {
    call(method: string, params?: unknown[]): Promise<unknown>;
    notify(method: string, params?: unknown[]): void;
    handleMessage(message: { id?: string, method: string, params?: unknown[] }): void;
    registerHandler(method: string, handler: (...args: unknown[]) => Promise<unknown>): void;
}

// luego completar funcionamiento, el rpc no sera encargado del trasporte, solo de la serializacion y deserializacion de mensajes, y del manejo de handlers y promesas pendientes.

export class RPCChannel implements IRPCChannel{
    
    private handlers = new Map<string, (...args: unknown[]) => Promise<unknown>>();
    private pending = new Map<string, {
        resolve: (value: unknown) => void,
        reject: (reason:unknown) => void
        timeoutId?: NodeJS.Timeout
    }>();

    call(method: string, params?: unknown[]): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    notify(method: string, params?: unknown[]): void {
        throw new Error("Method not implemented.");
    }
    handleMessage(message: { id?: string; method: string; params?: unknown[]; }): void {
        throw new Error("Method not implemented.");
    }
    registerHandler(method: string, handler: (...args: unknown[]) => Promise<unknown>): void {
        throw new Error("Method not implemented.");
    }
}

type RPCMessage =
  | { id: string; method: string; params?: any[] } // request
  | { id: string; result?: any; error?: any }      // response
  | { method: string; params?: any[] }             // notify