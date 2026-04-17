import {TypedServer, TypedSocket} from "../../types/types.js";
import {CreateRoomPayload} from "../../types/room/models.js";
import {createRoom, deleteRoom, getRoomById, getRooms, joinRoom} from "../../services/room.service.js";
import {getUser} from "../../services/user.service.js";

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
            socket.join(roomId);
            io.to(roomId).emit("room:user_joined", user);
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

            socket.join(room.id);
            io.emit("room:created", room);
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:delete", async (roomId, ack) => {
        try {
            if (!roomId) return ack("RoomId manquant");

            await deleteRoom(roomId);

            io.emit("room:deleted", roomId);
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });
}
