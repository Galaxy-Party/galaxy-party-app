import http from "http";
import { Server, Socket } from "socket.io";
import 'dotenv/config'
import {ClientToServerEvents, ServerToClientEvents} from "./types/socket.js";
import app from "./app.js";
import {initSocket} from "./socket/index.js";
import {apiClient} from "./lib/axios.js";



const httpserver = http.createServer(app);

export const io: Server = new Server<
    ClientToServerEvents,
    ServerToClientEvents
>(httpserver, {
    path: "/ws",
    cors: {
        origin: ["https://galaxy-party.fr", "http://localhost:5173"],
        methods: ["GET", "POST"],
    },
});

initSocket(io);

const PORT: number = Number(process.env.PORT) || 4000;

httpserver.listen(PORT, async () => {
    console.log(`WebSocket server running on port ${PORT}`);
    try {
        await apiClient.delete("/api/rooms");
        console.log("Rooms cleared on startup");
    } catch (e) {
        console.error("Failed to clear rooms on startup:", e);
    }
});