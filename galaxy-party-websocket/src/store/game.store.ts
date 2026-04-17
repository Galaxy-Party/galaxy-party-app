import { GameSession } from '../types/game/models.js';

const sessions = new Map<string, GameSession>();

export function getSession(roomId: string): GameSession | undefined {
    return sessions.get(roomId);
}

export function setSession(roomId: string, session: GameSession): void {
    sessions.set(roomId, session);
}

export function deleteSession(roomId: string): void {
    sessions.delete(roomId);
}