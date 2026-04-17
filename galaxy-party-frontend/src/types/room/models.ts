import type {User} from "../user/models.ts";

export interface Room {
    id: string;
    name: string;
    hasPassword: boolean;
    ownerId: string;
    users: User[];
}

export interface CreateRoomPayload {
    name: string;
    password?: string | null;
    ownerId: string;
}
