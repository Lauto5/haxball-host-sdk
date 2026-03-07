import { RPCMessage } from "../rpc/rpcMessage";

export interface ITransport {
    send(message: RPCMessage): void;
    onMessage(handler: (message: RPCMessage) => void): void;
}