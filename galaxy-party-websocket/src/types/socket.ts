import {Hello} from "./models.js";
import {CreateUserPayload, User} from "./user/models.js";

export interface ServerToClientEvents {
    "hello:message": (hello: Hello) => void;
    "user:created": (user: User) => void;
}

export interface ClientToServerEvents {
    "hello:send": (hello: Hello) => void;
    "user:create": (
        payload: CreateUserPayload,
        ack: (err?: string) => void
    ) => void;
}