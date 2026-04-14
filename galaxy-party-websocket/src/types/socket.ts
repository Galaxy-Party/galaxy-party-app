import {Hello} from "./models.js";

export interface ServerToClientEvents {
    "hello:message": (hello: Hello) => void;
}

export interface ClientToServerEvents {
    "hello:send": (hello: Hello) => void;
}