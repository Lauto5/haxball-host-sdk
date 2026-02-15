// src/types/haxball.d.ts
export {}; // Asegura que sea un módulo

declare global {
    // ============ CONFIGURACIÓN DE LA SALA ============
    interface RoomConfig {
        /** Nombre de la sala */
        roomName?: string;
        /** Máximo número de jugadores (1-32) */
        maxPlayers?: number;
        /** Si la sala es pública y aparece en la lista */
        public?: boolean;
        /** Geo ubicación de la sala */
        geo?: RoomGeoLocation;
        /** Token para autenticación (si es necesario) */
        token?: string;
    }
    
    interface RoomGeoLocation {
        /** Código de país (ej: "AR", "US", "BR") */
        code: string;
        /** Latitud */
        lat: number;
        /** Longitud */
        lon: number;
    }

    // ============ JUGADOR ============
    interface Player {
        /** ID único del jugador */
        id: number;
        /** Nombre del jugador */
        name: string;
        /** Equipo del jugador (0: rojo, 1: azul, 2: espectador) */
        team: number;
        /** Si es admin de la sala */
        admin: boolean;
        /** Posición en el campo {x, y} */
        position: PlayerPosition;
        /** Avatar/conn del jugador */
        conn: string;
        /** Si está auth (cuenta registrada) */
        auth?: string;
    }
    
    interface PlayerPosition {
        x: number;
        y: number;
    }

    // ============ DISCOS/PELOTA ============
    interface DiscProperties {
        /** Posición X */
        x: number;
        /** Posición Y */
        y: number;
        /** Velocidad en X */
        xspeed: number;
        /** Velocidad en Y */
        yspeed: number;
        /** Aceleración en X */
        xgravity: number;
        /** Aceleración en Y */
        ygravity: number;
        /** Radio del disco */
        radius: number;
        /** Inversa de la masa (bouncing) */
        bCoeff: number;
        /** Coefficiente de velocidad */
        invMass: number;
        /** Damping */
        damping: number;
        /** Color en hexadecimal */
        color: number;
        /** Si es colisionable */
        cMask: number;
        /** Grupos de colisión */
        cGroup: number;
    }

    // ============ MENSAJES DE CHAT ============
    interface ChatMessage {
        /** ID del jugador que envió el mensaje */
        playerId: number;
        /** Contenido del mensaje */
        message: string;
    }

    // ============ OBJETO ROOM (SALA) ============
    interface RoomObject {
        // ============ PROPIEDADES ============
        /** Lista de jugadores en la sala */
        getPlayerList(): Player[];
        /** Configuración de la sala */
        getConfig(): RoomConfig;
        /** Propiedades del disco/pelota */
        getDiscProperties(discId: number): DiscProperties | null;
        
        // ============ MÉTODOS DE CONTROL ============
        /** Enviar mensaje al chat */
        sendChat(message: string, targetId?: number): void;
        /** Cambiar propiedades del disco */
        setDiscProperties(discId: number, properties: Partial<DiscProperties>): void;
        /** Cambiar propiedades del jugador */
        setPlayerDiscProperties(playerId: number, properties: Partial<DiscProperties>): void;
        /** Kickear jugador */
        kickPlayer(playerId: number, reason?: string, ban?: boolean): void;
        /** Cambiar equipos */
        setTeamsLock(locked: boolean): void;
        /** Pausar/Reanudar juego */
        setPause(pause: boolean): void;
        /** Iniciar partida */
        startGame(): void;
        /** Detener partida */
        stopGame(): void;
        /** Cambiar puntuación */
        setScoreLimit(limit: number): void;
        /** Cambiar tiempo límite */
        setTimeLimit(limit: number): void;
        /** Cambiar stadium/mapa */
        setStadium(stadiumData: string | StadiumData): void;
        /** Cambiar configuración de la sala */
        setConfig(config: Partial<RoomConfig>): void;
        
        // ============ EVENTOS/CALLBACKS ============
        /** Cuando un jugador se une */
        onPlayerJoin?: (player: Player) => void;
        /** Cuando un jugador abandona */
        onPlayerLeave?: (player: Player) => void;
        /** Cuando un jugador envía un mensaje */
        onPlayerChat?: (player: Player, message: string) => void;
        /** Cuando un jugador toca la pelota */
        onPlayerBallKick?: (player: Player) => void;
        /** Cuando se anota un gol */
        onTeamGoal?: (team: number) => void;
        /** Cuando comienza el juego */
        onGameStart?: (byPlayer: Player) => void;
        /** Cuando termina el juego */
        onGameStop?: (byPlayer: Player) => void;
        /** Cuando se pausa el juego */
        onGamePause?: (byPlayer: Player) => void;
        /** Cuando se reanuda el juego */
        onGameUnpause?: (byPlayer: Player) => void;
        /** Cuando cambian los equipos */
        onTeamVictory?: (scores: number[]) => void;
        /** Cuando se cambia el stadium */
        onStadiumChange?: (newStadiumName: string, byPlayer: Player) => void;
        /** Cuando se cambia la configuración */
        onRoomLink?: (link: string) => void;
        
        // ============ MÉTODOS AVANZADOS ============
        /** Obtener estadísticas */
        getStats?(): RoomStats;
        /** Modo replay */
        startRecording?(): void;
        stopRecording?(): void;
        /** Plugins */
        getPlugin?(name: string): any;
        setPlugin?(name: string, plugin: any): void;
    }
    
    interface StadiumData {
        name: string;
        width: number;
        height: number;
        // ... más propiedades del stadium
    }
    
    interface RoomStats {
        playerCount: number;
        redScore: number;
        blueScore: number;
        time: number;
        // ... más estadísticas
    }

    // ============ FUNCIÓN PRINCIPAL HBInit ============
    interface HBInitFunction {
        /** Crea una nueva sala de Haxball */
        (config: RoomConfig): RoomObject;
        
        /** Versión de la API */
        version?: string;
        
        /** Funciones auxiliares (pueden variar) */
        utils?: {
            encodeStadium?(data: any): string;
            decodeStadium?(str: string): any;
            // ... otras utilidades
        };
    }

    // ============ EXTENSIÓN DE WINDOW ============
    interface Window {
        /** Función principal para crear salas */
        HBInit: HBInitFunction;
        
        /** Referencia a la sala actual (si existe) */
        room?: RoomObject;
        
        /** API de plugins */
        HBPlugin?: {
            new (room: RoomObject): any;
            [key: string]: any;
        };
        
        /** Objetos globales de Haxball */
        HBRoom?: typeof RoomObject;
        HBPlayer?: typeof Player;
        HBChat?: any;
        
        /** Para desarrollo/debug */
        __HAXBALL_DEBUG?: boolean;
    }
}