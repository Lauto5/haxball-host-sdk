export { };
    
export interface RoomConfig {
    roomName: string;
    playerName?: string;
    password?: string;
    maxPlayers: number;
    public: boolean;
    geo?: Geo;
    token: string;
    noPlayer: boolean;
}

declare global {
    interface Window {
        __hb__runtime: HBRuntime;
        __enviroument: EnviroumentTest;
    }
    
    interface EnviroumentTest{
        calculate(num: number, num2: number);
    }
    
    interface HBRuntime {
        room: any;
        saludar();
        init(config: RoomConfig): void;
        exec(method: string, args: any[]): any;
    }
    
}
