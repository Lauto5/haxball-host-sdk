# Documentación de la API de Room

## Métodos

### 1. `createRoom` 
- **Descripción**: Crea una nueva sala.
- **Parámetros**:
  - `name` (string): El nombre de la sala.
  - `maxPlayers` (int): Número máximo de jugadores en la sala.
- **Ejemplo**:
```javascript
createRoom('Sala 1', 10);
```

### 2. `joinRoom` 
- **Descripción**: Permite a un jugador unirse a una sala existente.
- **Parámetros**:
  - `roomId` (string): ID de la sala a la que el jugador quiere unirse.
- **Ejemplo**:
```javascript
joinRoom('12345');
```

### 3. `leaveRoom` 
- **Descripción**: Permite a un jugador salir de la sala.
- **Parámetros**:
  - `roomId` (string): ID de la sala de la que el jugador quiere salir.
- **Ejemplo**:
```javascript
leaveRoom('12345');
```

## Eventos

### 1. `roomCreated`
- **Descripción**: Se emite cuando se crea una nueva sala.
- **Ejemplo de uso**:
```javascript
socket.on('roomCreated', function(room){
    console.log('Sala creada:', room);
});
```

### 2. `playerJoined`
- **Descripción**: Se emite cuando un jugador se une a la sala.
- **Ejemplo de uso**:
```javascript
socket.on('playerJoined', function(player){
    console.log('Jugador unido:', player);
});
```

### 3. `playerLeft`
- **Descripción**: Se emite cuando un jugador sale de la sala.
- **Ejemplo de uso**:
```javascript
socket.on('playerLeft', function(player){
    console.log('Jugador salido:', player);
});
```
