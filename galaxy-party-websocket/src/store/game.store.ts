import { GameSession } from '../types/game/models.js';
import { Room } from '../types/room/models.js';

const sessions = new Map<string, GameSession>();

export function getPlayerTimes(session: GameSession): Record<string, number> {
    return Object.fromEntries([...session.players.entries()].map(([id, p]) => [id, p.timeRemaining]));
}

export function getSession(roomId: string): GameSession | undefined {
    return sessions.get(roomId);
}

export function setSession(roomId: string, session: GameSession): void {
    sessions.set(roomId, session);
}

export function deleteSession(roomId: string): void {
    sessions.delete(roomId);
}

export function annotateRooms(rooms: Room[]): Room[] {
    return rooms.map(r => ({ ...r, isInProgress: sessions.has(r.id) }));
}