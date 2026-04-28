import {TypedServer, TypedSocket} from "../../types/types.js";
import {CreateRoomPayload} from "../../types/room/models.js";
import {createRoom, deleteRoom, getRoomById, getRooms, joinRoom, leaveRoom, updateRoom} from "../../services/room.service.js";
import {getUser} from "../../services/user.service.js";
import {deleteSession} from "../../store/game.store.js";

export function registerRoomHandlers(
    io: TypedServer,
    socket: TypedSocket
) {
    socket.on("room:get_all", async (ack) => {
        try {
            const rooms = await getRooms();
            socket.emit("room:list", rooms);
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:get", async (roomId, ack) => {
        try {
            const room = await getRoomById(roomId);
            if (!room) return ack("Salon introuvable");
            socket.join(roomId);
            socket.emit("room:details", room);
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:join", async ({ roomId, userId, password }, ack) => {
        try {
            const success = await joinRoom(roomId, userId, password);
            if (!success) return ack("Mot de passe incorrect");
            const user = await getUser(userId);
            if (!user) return ack("Utilisateur introuvable");
            socket.data.userId = userId;
            socket.data.roomId = roomId;
            socket.join(roomId);
            io.to(roomId).emit("room:user_joined", user);
            const rooms = await getRooms();
            io.emit("room:list", rooms);
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:leave", async ({ roomId, userId }, ack) => {
        try {
            socket.data.roomId = undefined;
            socket.leave(roomId);
            deleteSession(roomId);
            const updatedRoom = await leaveRoom(roomId, userId);
            if (updatedRoom) {
                io.to(roomId).emit("room:user_left", userId);
                if (updatedRoom.ownerId !== userId) {
                    io.to(roomId).emit("room:owner_changed", updatedRoom.ownerId);
                }
                const rooms = await getRooms();
                io.emit("room:list", rooms);
            } else {
                io.emit("room:deleted", roomId);
            }
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:create", async (payload, ack) => {
        try {
            const { name, password, ownerId } = payload;

            if (!name || name.trim() === "") {
                return ack("Nom de salon invalide");
            }

            if (!ownerId) {
                return ack("OwnerId manquant");
            }

            const createRoomPayload: CreateRoomPayload = {
                name: name.trim(),
                password: password ?? null,
                ownerId,
            };

            const room = await createRoom(createRoomPayload);

            if (!room) {
                return ack("Erreur serveur");
            }

            await joinRoom(room.id, ownerId, password);

            socket.data.userId = ownerId;
            socket.data.roomId = room.id;
            socket.join(room.id);
            io.emit("room:created", room);
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:update", async ({ roomId, timer, password }, ack) => {
        try {
            const updated = await updateRoom(roomId, { timer, password });
            if (!updated) return ack("Erreur serveur");
            io.to(roomId).emit("room:details", updated);
            const rooms = await getRooms();
            io.emit("room:list", rooms);
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:delete", async (roomId, ack) => {
        try {
            if (!roomId) return ack("RoomId manquant");

            deleteSession(roomId);
            await deleteRoom(roomId);

            io.emit("room:deleted", roomId);
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });
}
