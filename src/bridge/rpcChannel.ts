import { Transport } from "../transport";
import { RPCMessage } from "./rpcMessage";

type PendingEntry = {
  resolve: ((value: unknown) => void);
  reject: ((reason?: unknown) => void);
  timeout?: ReturnType<typeof setTimeout>;
};

export class RPCChannel {
  private pending = new Map<string, PendingEntry>();
  private handlers = new Map<string, (params: unknown[]) => unknown | Promise<unknown>>();

  constructor(private transport: Transport, private defaultTimeout = 10000) {
    this.transport.onMessage((message) => {
        this.handleIncoming(message);
    });
  }

  // =========================
  // CLIENT SIDE (call)
  // =========================

  call(method: string, params?: unknown[], timeoutMs?: number): Promise<any> {
    const id = Math.random().toString(36).substr(2, 9); // generar ID unico

    // tipo de message : request
    const message: RPCMessage = {
      type: "request",
      id: id,
      method: method,
      params: params ?? [],
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`RPC timeout for method: ${method}`));
      }, timeoutMs ?? this.defaultTimeout);

      this.pending.set(id, { resolve, reject, timeout });

      this.transport.send(message);
    });
  }

  // =========================
  // SERVER SIDE (register)
  // =========================

  registerHandler(
    method: string,
    handler: (params: unknown[]) => unknown | Promise<unknown>
  ) {
    this.handlers.set(method, handler);
  }

  // =========================
  // MESSAGE ENTRY POINT
  // =========================

  private async handleIncoming(message: RPCMessage) {
    if (message.type === "response" || message.type === "error") {
      this.handleResponse(message);
      return;
    }

    if (message.type === "request") {
      await this.handleRequest(message);
    }
  }

  // =========================
  // RESPONSE HANDLING
  // =========================

  private handleResponse(message: RPCMessage) {
    const entry = this.pending.get(message.id);
    if (!entry) return;

    if (entry.timeout) {
      clearTimeout(entry.timeout);
    }

    this.pending.delete(message.id);

    if (message.type === "response") {
      entry.resolve(message.result);
    }

    if (message.type === "error") {
      entry.reject(new Error(message.error.message));
    }
  }

  // =========================
  // REQUEST HANDLING
  // =========================

  private async handleRequest(message: Extract<RPCMessage, { type: "request" }>) {
    const handler = this.handlers.get(message.method);

    if (!handler) {
      this.transport.send({
        type: "error",
        id: message.id,
        error: { message: `No handler registered for method: ${message.method}` },
        timestamp: Date.now()
      });
      return;
    }

    try {
      const result = await handler(message.params ?? []);

      this.transport.send({
        type: "response",
        id: message.id,
        result,
        timestamp: Date.now()
      });
    } catch (err) {
      this.transport.send({
        type: "error",
        id: message.id,
        error: { message: err instanceof Error ? err.message : String(err) },
        timestamp: Date.now()
      });
    }
  }
}