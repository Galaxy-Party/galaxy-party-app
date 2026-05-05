import { TypedServer, TypedSocket } from '../../types/types.js';
import { getQuestions} from '../../services/game.service.js';
import { getRooms } from '../../services/room.service.js';
import { getSession, setSession, deleteSession, getPlayerTimes, annotateRooms } from '../../store/game.store.js';
import { GameSession } from '../../types/game/models.js';
import { broadcastStatus } from './friend.js';

async function broadcastRoomList(io: TypedServer): Promise<void> {
    try {
        const rooms = await getRooms();
        io.emit('room:list', annotateRooms(rooms));
    } catch (_) { /* non-critique */ }
}

function normalize(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');
}

function emitQuestion(io: TypedServer, session: GameSession): void {
    if (session.currentQuestionIndex >= session.questions.length) {
        const winnerId = [...session.players.entries()].reduce((a, b) =>
            a[1].timeRemaining >= b[1].timeRemaining ? a : b
        )[0];
        const playerIds = [...session.players.keys()];
        deleteSession(session.roomId);
        io.to(session.roomId).emit('game:over', { winnerId });
        void broadcastRoomList(io);
        for (const playerId of playerIds) void broadcastStatus(io, playerId, 'inroom');
        return;
    }
    const question = session.questions[session.currentQuestionIndex];
    session.turnStartedAt = Date.now();
    io.to(session.roomId).emit('game:question', {
        question: { id: question.id, label: question.label },
        currentPlayerId: session.currentPlayerId,
        playerTimes: getPlayerTimes(session),
    });
}

function deductElapsed(session: GameSession, userId: string): void {
    if (session.turnStartedAt === null) return;
    const elapsed = Date.now() - session.turnStartedAt;
    const player = session.players.get(userId);
    if (player) player.timeRemaining = Math.max(0, player.timeRemaining - elapsed);
    session.turnStartedAt = null;
}

export function registerGameHandlers(io: TypedServer, socket: TypedSocket) {

    socket.on('game:start', async ({ roomId, timer }, ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack('Non authentifié');
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
                timer,
                questions,
                currentQuestionIndex: 0,
                currentPlayerId: userId,
                readyPlayers: new Set(),
                players: new Map(),
                turnStartedAt: null,
            };

            setSession(roomId, session);
            io.to(roomId).emit('game:loading');
            void broadcastRoomList(io);
            const roomSockets = [...io.sockets.sockets.values()].filter(s => s.data.roomId === roomId && s.data.userId);
            for (const s of roomSockets) void broadcastStatus(io, s.data.userId!, 'ingame');
            ack();
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('game:player_ready', ({ roomId }, ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack('Non authentifié');
            const session = getSession(roomId);
            if (!session) return ack('Session introuvable');

            session.players.set(userId, { userId, timeRemaining: session.timer });
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
                    emitQuestion(io, session);
                }
            }, 1000);
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('game:answer', ({ roomId, answer }, ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack('Non authentifié');
            const session = getSession(roomId);
            if (!session) return ack('Session introuvable');
            if (session.currentPlayerId !== userId) return ack('Ce n\'est pas ton tour');

            deductElapsed(session, userId);

            const question = session.questions[session.currentQuestionIndex];
            const correct = question.answers.some(a => normalize(a.answer) === normalize(answer));
            const correctAnswer = question.displayAnswer ?? question.answers[0].answer;

            io.to(roomId).emit('game:answer_result', {
                correct,
                correctAnswer,
                answeredBy: userId,
                playerTimes: getPlayerTimes(session),
            });
            ack();

            if (correct) {
                const players = [...session.players.keys()];
                session.currentPlayerId = players.find(id => id !== userId) ?? userId;
            }
            session.currentQuestionIndex++;

            setTimeout(() => emitQuestion(io, session), correct ? 1000 : 2000);
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('game:quit', ({ roomId }, ack) => {
        try {
            const session = getSession(roomId);
            const playerIds = session ? [...session.players.keys()] : [];
            deleteSession(roomId);
            io.to(roomId).emit('game:player_quit');
            void broadcastRoomList(io);
            for (const playerId of playerIds) void broadcastStatus(io, playerId, 'inroom');
            ack();
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('game:time_up', ({ roomId }, ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack('Non authentifié');
            const session = getSession(roomId);
            if (!session) return ack('Session introuvable');
            if (session.currentPlayerId !== userId) return ack();

            deductElapsed(session, userId);

            const players = [...session.players.keys()];
            const winnerId = players.find(id => id !== userId) ?? userId;

            deleteSession(roomId);
            io.to(roomId).emit('game:over', { winnerId });
            void broadcastRoomList(io);
            for (const playerId of players) void broadcastStatus(io, playerId, 'inroom');
            ack();
        } catch (e) {
            ack('Erreur serveur');
        }
    });
}