export { };
    
export interface RoomConfig {
    roomName: string;
    playerName?: string;
    password?: string;
    maxPlayers: number;
    public: boolean;
    geo?: Geo;
    token?: string;
    noPlayer: boolean;
}
