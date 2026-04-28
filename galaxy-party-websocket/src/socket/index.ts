import { TypedServer, TypedSocket } from "../types/types.js";
import { registerHelloHandlers } from "./handlers/hello.js";
import { registerRoomHandlers } from "./handlers/room.js";
import { registerGameHandlers } from "./handlers/game.js";
import { registerFriendHandlers, broadcastStatus, sendFriendList } from "./handlers/friend.js";
import { leaveRoom } from "../services/room.service.js";
import { deleteSession } from "../store/game.store.js";
import { socketAuthMiddleware } from "./auth.js";

export function initSocket(io: TypedServer) {
    io.use(socketAuthMiddleware);

    io.on("connection", async (socket: TypedSocket) => {
        registerHelloHandlers(io, socket);
        registerRoomHandlers(io, socket);
        registerGameHandlers(io, socket);
        registerFriendHandlers(io, socket);

        const userId = socket.data.userId;
        if (userId) {
            await sendFriendList(io, socket);
            await broadcastStatus(io, userId, 'online');
        }

        socket.on("disconnect", async () => {
            const { userId, roomId } = socket.data;
            if (!userId) return;

            await broadcastStatus(io, userId, 'offline');

            if (!roomId) return;

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
