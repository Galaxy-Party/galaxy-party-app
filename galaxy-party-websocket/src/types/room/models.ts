import {User} from "../user/models.js";

export interface Room {
    id: string;
    name: string;
    hasPassword: boolean;
    ownerId: string;
    timer: number | null;
    users: User[];
}

export interface CreateRoomPayload {
    name: string;
    password?: string | null;
    ownerId: string;
}
