import {TypedServer, TypedSocket} from "../../types/types.js";
import {CreateRoomPayload} from "../../types/room/models.js";
import {createRoom, getRooms, joinRoom} from "../../services/room.service.js";

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

            io.emit("room:created", room);
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });
}
