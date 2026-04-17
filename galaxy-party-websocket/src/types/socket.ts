import {Hello} from "./models.js";
import {CreateUserPayload, User} from "./user/models.js";
import {CreateRoomPayload, Room} from "./room/models.js";

export interface ServerToClientEvents {
    "hello:message": (hello: Hello) => void;
    "user:created": (user: User) => void;
    "user:received": (user:User) => void;
    "room:created": (room: Room) => void;
    "room:list": (rooms: Room[]) => void;
}

export interface ClientToServerEvents {
    "hello:send": (hello: Hello) => void;
    "user:create": (
        payload: CreateUserPayload,
        ack: (err?: string) => void
    ) => void;
    "user:get": (
        id: string,
        ack: (err?: string) => void
    ) => void;
    "room:create": (
        payload: CreateRoomPayload,
        ack: (err?: string) => void
    ) => void;
    "room:get_all": (ack: (err?: string) => void) => void;
}