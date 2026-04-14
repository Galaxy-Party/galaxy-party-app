import { io, Socket } from "socket.io-client";
import type {ClientToServerEvents, ServerToClientEvents} from "../types/sockets.ts";

type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const socket: ClientSocket = io(import.meta.env.VITE_WS_URL, {
    path: "/ws",
    transports: ["polling", "websocket"]
});

export default socket;