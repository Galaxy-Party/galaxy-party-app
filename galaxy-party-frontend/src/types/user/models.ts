export interface User {
    id: string;
    username: string;
    imageName?: string | null;
}

export interface CreateUserPayload {
    username: string;
    imageName?: string | null;
}