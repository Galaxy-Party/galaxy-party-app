import { TypedServer, TypedSocket } from '../../types/types.js';
import { enqueue, dequeue, findMatch, markRoomAsRanked } from '../../store/queue.store.js';
import { getUser } from '../../services/user.service.js';
import { createRoom, joinRoom } from '../../services/room.service.js';
import { broadcastStatus } from './friend.js';
import { getLeaderboard, getRankDefinitions } from '../../services/ranked.service.js';
import { getQuestions } from '../../services/game.service.js';
import { setSession } from '../../store/game.store.js';
import { GameSession } from '../../types/game/models.js';

const RANKED_TIMER_MS = 150_000;

export function registerRankedHandlers(io: TypedServer, socket: TypedSocket) {

    socket.on('ranked:join_queue', async (ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack('Non authentifié');
            dequeue(userId);

            const user = await getUser(userId);
            if (!user) return ack('Utilisateur introuvable');

            const elo = user.elo ?? 0;
            enqueue(userId, elo);

            const opponent = findMatch(userId, elo);
            if (!opponent) return ack();

            dequeue(userId);
            // Opponent stays in queue until the room is confirmed ready

            const opponentUser = await getUser(opponent.userId);
            if (!opponentUser) return ack('Erreur serveur');

            const room = await createRoom({
                name: `${user.username} vs ${opponentUser.username}`,
                ownerId: userId,
                password: null,
            });
            if (!room) return ack('Erreur lors de la création du salon');

            // Room is ready — remove opponent from queue now
            dequeue(opponent.userId);

            markRoomAsRanked(room.id);

            await Promise.all([
                joinRoom(room.id, userId, null),
                joinRoom(room.id, opponent.userId, null),
            ]);

            socket.data.roomId = room.id;
            socket.join(room.id);
            await broadcastStatus(io, userId, 'ingame');

            const opponentSocket = [...io.sockets.sockets.values()].find(s => s.data.userId === opponent.userId);
            if (opponentSocket) {
                opponentSocket.data.roomId = room.id;
                opponentSocket.join(room.id);
                await broadcastStatus(io, opponent.userId, 'ingame');
            }

            const questions = await getQuestions();
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }

            const session: GameSession = {
                roomId: room.id,
                ownerId: userId,
                timer: RANKED_TIMER_MS,
                ranked: true,
                questions,
                currentQuestionIndex: 0,
                currentPlayerId: userId,
                readyPlayers: new Set(),
                players: new Map(),
                turnStartedAt: null,
            };
            setSession(room.id, session);

            if (opponentSocket) {
                opponentSocket.emit('ranked:match_found', {
                    roomId: room.id,
                    opponent: { userId, username: user.username, imageName: user.imageName ?? null, elo },
                });
            }
            socket.emit('ranked:match_found', {
                roomId: room.id,
                opponent: { userId: opponent.userId, username: opponentUser.username, imageName: opponentUser.imageName ?? null, elo: opponent.elo },
            });

            io.to(room.id).emit('game:loading');
            io.to(room.id).emit('ranked:session_started');

            ack();
        } catch (e) {
            console.error('ranked:join_queue error:', e);
            ack('Erreur serveur');
        }
    });

    socket.on('ranked:leave_queue', async (ack) => {
        const userId = socket.data.userId;
        if (userId) dequeue(userId);
        ack();
    });

    socket.on('ranked:get_leaderboard', async (ack) => {
        try {
            const userId = socket.data.userId!;
            const [entries, ranks, me] = await Promise.all([
                getLeaderboard(),
                getRankDefinitions(),
                getUser(userId),
            ]);
            socket.emit('ranked:leaderboard', { entries, myElo: me?.elo ?? 0 });
            socket.emit('ranked:ranks', ranks);
            ack();
        } catch (e) {
            console.error('ranked:get_leaderboard error:', e);
            ack('Erreur serveur');
        }
    });
}
