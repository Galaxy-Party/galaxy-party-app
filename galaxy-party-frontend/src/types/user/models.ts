export interface User {
    id: string;
    username: string;
    imageName?: string | null;
    elo: number;
}

export interface CreateUserPayload {
    username: string;
    imageName?: string | null;
}