
interface BaseMessage {
    id: string;
    timestamp: number;
}

interface RPCResquest extends BaseMessage {
    type: "request";
    method: string;
    params?: unknown[];
}

interface RPCResponse extends BaseMessage {
    type: "response";
    result?: unknown;
}

interface RPCError extends BaseMessage {
    type: "error";
    error: {
        message: string;
        code?: number;
        data?: unknown;
    }
}

export type RPCMessage = RPCResquest | RPCResponse | RPCError;