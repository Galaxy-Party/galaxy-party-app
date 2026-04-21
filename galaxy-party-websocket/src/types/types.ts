
import type { Server, Socket } from "socket.io";
import type {
    ClientToServerEvents,
    ServerToClientEvents
} from "./socket.js"

interface SocketData {
    userId?: string;
    roomId?: string;
}

export type TypedServer = Server<
    ClientToServerEvents,
    ServerToClientEvents
>;

export type TypedSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    never,
    SocketData
>;