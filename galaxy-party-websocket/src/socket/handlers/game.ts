import { TypedServer, TypedSocket } from '../../types/types.js';
import { getQuestions } from '../../services/game.service.js';
import { getSession, setSession, deleteSession } from '../../store/game.store.js';
import { GameSession } from '../../types/game/models.js';

const TIMER_MS = 150_000; // 2:30

export function registerGameHandlers(io: TypedServer, socket: TypedSocket) {

    socket.on('game:start', async (roomId, ack) => {
        try {
            if (getSession(roomId)) return ack('Partie déjà en cours');

            const questions = await getQuestions();
            if (!questions.length) return ack('Aucune question disponible');

            const roomSockets = await io.in(roomId).fetchSockets();
            const playerIds = roomSockets.map(s => s.id);

            const session: GameSession = {
                roomId,
                ownerId: socket.id,
                questions,
                currentQuestionIndex: 0,
                currentPlayerId: socket.id,
                readyPlayers: new Set(),
                players: new Map(
                    playerIds.map(id => [id, { userId: id, timeRemaining: TIMER_MS }])
                ),
            };

            setSession(roomId, session);
            io.to(roomId).emit('game:loading');
            ack();
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('game:player_ready', (roomId, ack) => {
        try {
            const session = getSession(roomId);
            if (!session) return ack('Session introuvable');

            session.readyPlayers.add(socket.id);
            ack();

            if (session.readyPlayers.size < 2) return;

            let count = 3;
            io.to(roomId).emit('game:countdown', count);
            const interval = setInterval(() => {
                count--;
                if (count > 0) {
                    io.to(roomId).emit('game:countdown', count);
                } else {
                    clearInterval(interval);
                    io.to(roomId).emit('game:started', {
                        currentPlayerId: session.currentPlayerId,
                    });
                }
            }, 1000);
        } catch (e) {
            ack('Erreur serveur');
        }
    });
}