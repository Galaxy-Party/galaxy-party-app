import { io, Socket } from "socket.io-client";
import type {ClientToServerEvents, ServerToClientEvents} from "../types/sockets.ts";

type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const wsUrl = import.meta.env.VITE_WS_URL || window.location.origin;

const socket: ClientSocket = io(wsUrl, {
    path: "/ws",
    transports: ["polling", "websocket"],
    withCredentials: true,
    autoConnect: false,
});

export default socket;