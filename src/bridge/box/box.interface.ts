import { RPCMessage } from "../rpc/rpcMessage";
import { ITransport } from "../transport/transport.interface";

export interface IBox {
  injectTransport(transport: ITransport): void;
  connectToRPC(callback: (message:RPCMessage) => void): void;
}