export interface Room {
    id: string;
    name: string;
    hasPassword: boolean;
    ownerId: string;
}

export interface CreateRoomPayload {
    name: string;
    password?: string | null;
    ownerId: string;
}
