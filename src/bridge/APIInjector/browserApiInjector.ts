

type RpcRequest = (method: string, payload?: any) => Promise<any>;

// luego implementar la interfaz real
class BrowserApiInjector {

    // aqui guardamos los listeners de cada evento, para luego poder llamarlos cuando el evento ocurra.
    private listeners: Map<string, Function[]> = new Map();

    constructor(private rpcCall: RpcRequest) {
    }

    // aun sin implementar, solo para probar la estructura, luego implementar correctamente cada metodo.

    HBInit(config: RoomConfig): Promise<void> {
        return this.rpcCall("HBInit", {config});
    }

    onPlayerJoin(callback: (player: Player) => void): void {
        this.addListener("playerJoin", callback);
    }

    // Metodos privados.

    private addListener(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    __dispatchEvent(event: string, ...args: any[]): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            for (const listener of eventListeners) {
                try {
                    listener(...args);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            }
        }
    }
}