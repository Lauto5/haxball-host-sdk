
import { RPCMessage } from "./bridge/rpcMessage";
import { ILogger } from "./logger";

export class Transport {

    private logger: ILogger;
    private handler?:(message: RPCMessage) => void;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    send(message: RPCMessage): void {
        // implementar transporte real, por ejemplo usando postMessage o WebSocket
        this.logger.info("Sending message:", message);
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