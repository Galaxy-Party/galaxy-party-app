import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*"
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`Client connecté : ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client déconnecté : ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
