import type {Hello} from "./models.ts";
import type {CreateUserPayload, User} from "./user/models.ts";

export interface ServerToClientEvents {
    "hello:message": (hello: Hello) => void;
    "user:created": (user: User) => void;
    "user:received": (user:User) => void;
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
}