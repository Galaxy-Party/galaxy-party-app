import type {Hello} from "./models.ts";

export interface ServerToClientEvents {
    "hello:message": (hello: Hello) => void;
}

export interface ClientToServerEvents {
    "hello:send": (hello: Hello) => void;
}