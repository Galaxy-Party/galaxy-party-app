import {TypedServer, TypedSocket} from "../../types/types.js";
import {CreateRoomPayload, Room} from "../../types/room/models.js";
import {createRoom, deleteRoom, getRoomById, getRooms, joinRoom, leaveRoom, updateRoom} from "../../services/room.service.js";
import {getUser} from "../../services/user.service.js";
import {deleteSession, getSession} from "../../store/game.store.js";
import {addSpectator, removeSpectator} from "../../store/spectator.store.js";
import {broadcastStatus} from "./friend.js";

function withStatus(rooms: Room[]): Room[] {
    return rooms.map(r => ({ ...r, isInProgress: !!getSession(r.id) }));
}

export function registerRoomHandlers(
    io: TypedServer,
    socket: TypedSocket
) {
    socket.on("room:get_all", async (ack) => {
        try {
            const rooms = await getRooms();
            socket.emit("room:list", withStatus(rooms));
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:get", async (roomId, ack) => {
        try {
            const userId = socket.data.userId;
            const room = await getRoomById(roomId);
            if (!room) return ack("Salon introuvable");
            socket.join(roomId);
            const isInRoom = userId && room.users.some((u: { id: string }) => u.id === userId);
            if (isInRoom && socket.data.roomId !== roomId) {
                socket.data.roomId = roomId;
                await broadcastStatus(io, userId!, 'inroom');
            }
            socket.emit("room:details", { ...room, isInProgress: !!getSession(roomId) });
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:join", async ({ roomId, password }, ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack("Non authentifié");
            const success = await joinRoom(roomId, userId, password);
            if (!success) return ack("Mot de passe incorrect");
            const user = await getUser(userId);
            if (!user) return ack("Utilisateur introuvable");
            socket.data.roomId = roomId;
            socket.join(roomId);
            io.to(roomId).emit("room:user_joined", user);
            const rooms = await getRooms();
            io.emit("room:list", withStatus(rooms));
            await broadcastStatus(io, userId, 'inroom');
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:leave", async ({ roomId }, ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack("Non authentifié");
            socket.data.roomId = undefined;
            socket.leave(roomId);
            deleteSession(roomId);
            await broadcastStatus(io, userId, 'online');
            const updatedRoom = await leaveRoom(roomId, userId);
            if (updatedRoom) {
                io.to(roomId).emit("room:user_left", userId);
                if (updatedRoom.ownerId !== userId) {
                    io.to(roomId).emit("room:owner_changed", updatedRoom.ownerId);
                }
                const rooms = await getRooms();
                io.emit("room:list", withStatus(rooms));
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
            const userId = socket.data.userId;
            if (!userId) return ack("Non authentifié");

            const { name, password } = payload;

            if (!name || name.trim() === "") {
                return ack("Nom de salon invalide");
            }

            const createRoomPayload: CreateRoomPayload = {
                name: name.trim(),
                password: password ?? null,
                ownerId: userId,
            };

            const room = await createRoom(createRoomPayload);

            if (!room) {
                return ack("Erreur serveur");
            }

            await joinRoom(room.id, userId, password ?? undefined);

            socket.data.roomId = room.id;
            socket.join(room.id);
            io.emit("room:created", room);
            await broadcastStatus(io, userId, 'inroom');
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:update", async ({ roomId, timer, password }, ack) => {
        try {
            const updated = await updateRoom(roomId, { timer, password });
            if (!updated) return ack("Erreur serveur");
            io.to(roomId).emit("room:details", { ...updated, isInProgress: !!getSession(roomId) });
            const rooms = await getRooms();
            io.emit("room:list", withStatus(rooms));
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

    socket.on("room:spectate", async ({ roomId }, ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack("Non authentifié");

            const session = getSession(roomId);
            if (!session) return ack("Aucune partie en cours dans ce salon");

            const room = await getRoomById(roomId);
            if (!room) return ack("Salon introuvable");

            socket.data.spectatingRoomId = roomId;
            socket.join(roomId);
            addSpectator(roomId, socket.id, userId);

            socket.emit("room:details", { ...room, isInProgress: true });

            const q = session.questions[session.currentQuestionIndex];
            const elapsed = session.turnStartedAt !== null ? Date.now() - session.turnStartedAt : 0;
            const liveTimes = Object.fromEntries(
                [...session.players.entries()].map(([id, p]) => [
                    id,
                    id === session.currentPlayerId
                        ? Math.max(0, p.timeRemaining - elapsed)
                        : p.timeRemaining,
                ])
            );
            socket.emit("game:spectator_state", {
                question: q ? { id: q.id, label: q.label } : null,
                currentPlayerId: session.currentPlayerId,
                playerTimes: liveTimes,
            });

            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });

    socket.on("room:spectate_leave", ({ roomId }, ack) => {
        try {
            socket.data.spectatingRoomId = undefined;
            socket.leave(roomId);
            removeSpectator(roomId, socket.id);
            ack();
        } catch (e) {
            ack("Erreur serveur");
        }
    });
}