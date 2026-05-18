export interface User {
    id: string;
    username: string;
    imageName?: string | null;
    elo: number;
    wins: number;
    gamesPlayed: number;
    xp: number;
    level: number;
    equippedTitle?: string | null;
}

export interface CreateUserPayload {
    username: string;
    imageName?: string | null;
}