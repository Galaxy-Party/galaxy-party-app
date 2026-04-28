const spectators = new Map<string, Map<string, string>>(); // roomId -> Map<socketId, userId>

export function addSpectator(roomId: string, socketId: string, userId: string): void {
    if (!spectators.has(roomId)) spectators.set(roomId, new Map());
    spectators.get(roomId)!.set(socketId, userId);
}

export function removeSpectator(roomId: string, socketId: string): string | undefined {
    const room = spectators.get(roomId);
    if (!room) return undefined;
    const userId = room.get(socketId);
    room.delete(socketId);
    if (room.size === 0) spectators.delete(roomId);
    return userId;
}

export function clearSpectators(roomId: string): void {
    spectators.delete(roomId);
}