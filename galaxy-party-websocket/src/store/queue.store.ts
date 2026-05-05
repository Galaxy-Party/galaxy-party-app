export interface QueueEntry {
    userId: string;
    elo: number;
    joinedAt: number;
}

const queue = new Map<string, QueueEntry>();
const rankedRooms = new Set<string>();

export function enqueue(userId: string, elo: number): void {
    queue.set(userId, { userId, elo, joinedAt: Date.now() });
}

export function dequeue(userId: string): void {
    queue.delete(userId);
}

export function isInQueue(userId: string): boolean {
    return queue.has(userId);
}

export function findMatch(userId: string, elo: number): QueueEntry | undefined {
    const entry = queue.get(userId);
    const waitTime = entry ? Date.now() - entry.joinedAt : 0;
    const range = waitTime > 30000 ? 400 : 200;

    for (const [id, candidate] of queue.entries()) {
        if (id === userId) continue;
        if (Math.abs(candidate.elo - elo) <= range) return candidate;
    }
    return undefined;
}

export function markRoomAsRanked(roomId: string): void {
    rankedRooms.add(roomId);
}

export function isRankedRoom(roomId: string): boolean {
    return rankedRooms.has(roomId);
}

export function unmarkRankedRoom(roomId: string): void {
    rankedRooms.delete(roomId);
}
