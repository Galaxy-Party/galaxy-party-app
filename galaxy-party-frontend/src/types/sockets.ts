import type {Hello} from "./models.ts";
import type {CreateUserPayload, User} from "./user/models.ts";
import type {CreateRoomPayload, Room} from "./room/models.ts";

export interface ServerToClientEvents {
    "game:loading": () => void;
    "game:countdown": (count: number) => void;
    "game:started": (data: { currentPlayerId: string }) => void;
    "game:question": (data: { question: { id: string; label: string }; currentPlayerId: string }) => void;
    "hello:message": (hello: Hello) => void;
    "user:created": (user: User) => void;
    "user:received": (user:User) => void;
    "room:created": (room: Room) => void;
    "room:deleted": (roomId: string) => void;
    "room:list": (rooms: Room[]) => void;
    "room:details": (room: Room) => void;
    "room:user_joined": (user: User) => void;
    "room:user_left": (userId: string) => void;
    "room:owner_changed": (newOwnerId: string) => void;
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
    "game:start": (payload: { roomId: string; userId: string }, ack: (err?: string) => void) => void;
    "game:player_ready": (payload: { roomId: string; userId: string }, ack: (err?: string) => void) => void;
    "room:delete": (roomId: string, ack: (err?: string) => void) => void;
    "room:get": (roomId: string, ack: (err?: string) => void) => void;
    "room:leave": (payload: { roomId: string; userId: string }, ack: (err?: string) => void) => void;
    "room:join": (
        payload: { roomId: string; userId: string; password?: string },
        ack: (err?: string) => void
    ) => void;
}