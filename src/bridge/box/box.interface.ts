import { RPCMessage } from "../rpc/rpcMessage";
import { ITransport } from "../transport/transport.interface";

// Definir una interface para las box's , RECORDATORIO DE LO QUE HAY QUE HACER.
export interface IBox {
  execute(method: string, args: any[]): void;
  injectExecuter(): void;
  reciveEvent(): void;
}