import {TypedServer, TypedSocket} from "../types/types.js";
import {registerHelloHandlers} from "./handlers/hello.js";
import {registerUserHandlers} from "./handlers/user.js";
import {registerRoomHandlers} from "./handlers/room.js";
import {registerGameHandlers} from "./handlers/game.js";
import {leaveRoom} from "../services/room.service.js";
import {deleteSession} from "../store/game.store.js";


export function initSocket(io: TypedServer) {
    io.on("connection", (socket: TypedSocket) => {
        registerHelloHandlers(io, socket);
        registerUserHandlers(io, socket);
        registerRoomHandlers(io, socket);
        registerGameHandlers(io, socket);

        socket.on("disconnect", async () => {
            const { userId, roomId } = socket.data;
            if (!userId || !roomId) return;

            try {
                deleteSession(roomId);
                const updatedRoom = await leaveRoom(roomId, userId);
                if (updatedRoom) {
                    io.to(roomId).emit("room:user_left", userId);
                    if (updatedRoom.ownerId !== userId) {
                        io.to(roomId).emit("room:owner_changed", updatedRoom.ownerId);
                    }
                } else {
                    io.emit("room:deleted", roomId);
                }
            } catch (e) {
                console.error("Erreur lors de la déconnexion:", e);
            }
        });
    });
}