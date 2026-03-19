import { RPCMessage } from "../rpc/rpcMessage";
import { ITransport } from "../transport/transport.interface";

// Definir una interface para las box's , RECORDATORIO DE LO QUE HAY QUE HACER.
export interface IBox {
  injectTransport(transport: ITransport): void;
  connectToRPC(callback: (message:RPCMessage) => void): void;
}