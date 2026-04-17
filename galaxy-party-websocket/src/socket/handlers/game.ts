import { TypedServer, TypedSocket } from '../../types/types.js';
import { getQuestions } from '../../services/game.service.js';
import { getSession, setSession } from '../../store/game.store.js';
import { GameSession } from '../../types/game/models.js';

const TIMER_MS = 150_000; // 2:30

export function registerGameHandlers(io: TypedServer, socket: TypedSocket) {

    socket.on('game:start', async ({ roomId, userId }, ack) => {
        try {
            if (getSession(roomId)) return ack('Partie déjà en cours');

            const questions = await getQuestions();
            if (!questions.length) return ack('Aucune question disponible');

            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }

            const session: GameSession = {
                roomId,
                ownerId: userId,
                questions,
                currentQuestionIndex: 0,
                currentPlayerId: userId,
                readyPlayers: new Set(),
                players: new Map(),
            };

            setSession(roomId, session);
            io.to(roomId).emit('game:loading');
            ack();
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('game:player_ready', ({ roomId, userId }, ack) => {
        try {
            const session = getSession(roomId);
            if (!session) return ack('Session introuvable');

            session.players.set(userId, { userId, timeRemaining: TIMER_MS });
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
                    io.to(roomId).emit('game:started', { currentPlayerId: session.currentPlayerId });

                    const question = session.questions[session.currentQuestionIndex];
                    io.to(roomId).emit('game:question', {
                        question: { id: question.id, label: question.label },
                        currentPlayerId: session.currentPlayerId,
                    });
                }
            }, 1000);
        } catch (e) {
            ack('Erreur serveur');
        }
    });
}