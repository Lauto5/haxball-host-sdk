
import { RPCMessage } from "../rpc/rpcMessage";
import { ILogger, ScopedLogger } from "../../logger";
import { ITransport } from "./transport.interface";

export class Transport implements ITransport {

    private logger: ILogger;
    private handler?:(message: RPCMessage) => void;

    constructor(logger: ILogger) {
        this.logger = new ScopedLogger(logger,"Transport");
    }

    send(message: RPCMessage): void {
        // implementar transporte real, por ejemplo usando postMessage o WebSocket
        this.logger.debug("Sending message:", message);
        setTimeout(() => {
            this.handler?.(message);
        }, 100); // simular retraso
    }

    onMessage(handler: (message: RPCMessage) => void): void {
        // implementar escucha de mensajes, por ejemplo usando addEventListener o WebSocket.onmessage
        this.handler = handler;
        this.logger.info("Message handler registered.");
    }
}