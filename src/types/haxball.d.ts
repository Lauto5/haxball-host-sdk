export { };
  
export interface BridgeLaunchConfig {
    runtime: 'puppeteer' | 'playwright';
    system: 'linux' | 'windows' | 'mac' | 'unknown';
    executablePath?: string;
}
    
// export interface RoomConfig {
//     roomName: string;
//     playerName?: string;
//     password?: string;
//     maxPlayers: number;
//     public: boolean;
//     geo?: Geo;
//     token?: string;
//     noPlayer: boolean;
// }
