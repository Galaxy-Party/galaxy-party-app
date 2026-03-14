import express from "express";
import type { Express } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import {getHello} from "./services/helloService.js";

const app: Express = express();

const server = http.createServer(app);

const io: Server = new Server(server, {
    path: "/ws",
    cors: {
        origin: ["https://galaxy-party.fr"],
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket: Socket) => {
    console.log(`Client connecté : ${socket.id}`);

    socket.on("hello", () => {
        getHello().then((data) => {
            io.emit("hello response", data)
        })
    })

    socket.on("disconnect", () => {
        console.log(`Client déconnecté : ${socket.id}`);
    });
});

const PORT: number = Number(process.env.PORT) || 4000;

server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});