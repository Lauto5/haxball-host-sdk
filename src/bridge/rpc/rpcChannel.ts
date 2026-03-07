import { ILogger , ScopedLogger } from "../../logger";
import { Transport } from "../transport/transport";
import { RPCMessage } from "./rpcMessage";
import { IRPCChannel , PendingEntry } from "./rpcchannel.interface";


export class RPCChannel implements IRPCChannel {
  private pending = new Map<string, PendingEntry>();
  private handlers = new Map<string, (params: unknown[]) => unknown | Promise<unknown>>();

  private logger: ILogger;

  constructor(private transport: Transport, private defaultTimeout = 10000 , private rootLogger: ILogger) {
    this.logger = new ScopedLogger(rootLogger,"RPC-Channel");

    this.logger.debug("🛠 Iniciando RPC-Channel");

    this.logger.debug("🛠 Vinculando Transport onMenssage....");

    // vincula onMessage con handleIncoming.
    this.transport.onMessage((message) => {
        this.handleIncoming(message);
    });

    this.logger.debug("🛠 Vinculado con exito Transport onMenssage");

  }
  

  // =========================
  // CLIENT SIDE (call)
  // =========================

  call(method: string, params?: unknown[], timeoutMs?: number): Promise<any> {
    this.logger.debug("🛠 Ejecutando call", {method,params,timeoutMs});
    
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
        reject(new Error(`🛠 RPC timeout for method: ${method}`));
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
    this.logger.debug("🛠 Registrando metodo",{method:method,handler:handler.toString()});
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