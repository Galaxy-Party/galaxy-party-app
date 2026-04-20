import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import backImg from "../../assets/back.png";
import { useUserContext } from "../../hooks/useUserContext.ts";
import ModalButton from "../../components/ModalButton.tsx";
import { useSocket } from "../../hooks/useSocket.ts";
import socket from "../../socket/client.ts";
import type { Room } from "../../types/room/models.ts";

function formatTime(ms: number): string {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function GamePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useUserContext();

    const [room, setRoom] = useState<Room | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
    const [question, setQuestion] = useState<{ id: string; label: string } | null>(null);
    const [answer, setAnswer] = useState("");
    const [answerResult, setAnswerResult] = useState<{ correct: boolean; correctAnswer: string } | null>(null);
    const [playerTimes, setPlayerTimes] = useState<Record<string, number>>({});
    const [winnerId, setWinnerId] = useState<string | null>(null);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const opponent = room?.users.find(u => u.id !== user?.id) ?? null;
    const isMyTurn = currentPlayerId === user?.id;
    const myTime = user ? (playerTimes[user.id] ?? 0) : 0;
    const opponentTime = opponent ? (playerTimes[opponent.id] ?? 0) : 0;

    useEffect(() => {
        if (!id || !user) return;
        socket.emit("room:get", id, (err) => { if (err) console.error(err); });
        socket.emit("game:player_ready", { roomId: id, userId: user.id }, (err) => { if (err) console.error(err); });
    }, [id, user]);

    // Timer: défile sur les deux clients pour le joueur courant, pause pendant le feedback
    useEffect(() => {
        if (!currentPlayerId || answerResult !== null || !id || !user) return;

        timerRef.current = setInterval(() => {
            setPlayerTimes(prev => {
                const current = prev[currentPlayerId] ?? 0;
                if (current <= 1000) {
                    clearInterval(timerRef.current!);
                    if (currentPlayerId === user.id) {
                        socket.emit("game:time_up", { roomId: id, userId: user.id }, () => {});
                    }
                    return { ...prev, [currentPlayerId]: 0 };
                }
                return { ...prev, [currentPlayerId]: current - 1000 };
            });
        }, 1000);

        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [currentPlayerId, answerResult, id, user]);

    const handleRoomDetails = useCallback((r: Room) => setRoom(r), []);
    const handleCountdown = useCallback((count: number) => setCountdown(count), []);
    const handleGameStarted = useCallback(({ currentPlayerId }: { currentPlayerId: string }) => {
        setCurrentPlayerId(currentPlayerId);
        setCountdown(null);
    }, []);
    const handleQuestion = useCallback(({ question, currentPlayerId, playerTimes }: { question: { id: string; label: string }; currentPlayerId: string; playerTimes: Record<string, number> }) => {
        setQuestion(question);
        setCurrentPlayerId(currentPlayerId);
        setPlayerTimes(playerTimes);
        setAnswer("");
        setAnswerResult(null);
    }, []);
    const handleAnswerResult = useCallback(({ correct, correctAnswer, playerTimes }: { correct: boolean; correctAnswer: string; answeredBy: string; playerTimes: Record<string, number> }) => {
        setAnswerResult({ correct, correctAnswer });
        setPlayerTimes(playerTimes);
    }, []);
    const handleGameOver = useCallback(({ winnerId }: { winnerId: string }) => {
        setWinnerId(winnerId);
    }, []);
    const handlePlayerQuit = useCallback(() => {
        navigate(`/rooms/${id}`);
    }, [navigate, id]);

    useSocket("room:details", handleRoomDetails);
    useSocket("game:countdown", handleCountdown);
    useSocket("game:started", handleGameStarted);
    useSocket("game:question", handleQuestion);
    useSocket("game:answer_result", handleAnswerResult);
    useSocket("game:over", handleGameOver);
    useSocket("game:player_quit", handlePlayerQuit);

    const submitAnswer = useCallback(() => {
        if (currentPlayerId !== user?.id || !answer.trim() || !id || !user) return;
        socket.emit("game:answer", { roomId: id, userId: user.id, answer }, (err) => { if (err) console.error(err); });
    }, [currentPlayerId, user, answer, id]);

    const accentColor = "#DEB992";

    const activeRingStyle: React.CSSProperties = {
        boxShadow: `0 0 0 4px ${accentColor}, 0 0 20px ${accentColor}55`,
        borderRadius: "9999px",
    };
    const inactiveRingStyle: React.CSSProperties = {
        boxShadow: "0 0 0 2px #4E8098",
        borderRadius: "9999px",
        opacity: 0.5,
    };

    return (
        <div
            className="flex flex-col w-full min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backImg})` }}
        >
            {/* Loading overlay */}
            {currentPlayerId === null && countdown === null && (
                <div className="absolute inset-0 flex items-center justify-center z-20" style={{ backgroundColor: "rgba(5,18,64,0.85)" }}>
                    <span className="text-white text-3xl tracking-widest animate-pulse">Chargement...</span>
                </div>
            )}

            {/* Game over modal */}
            {winnerId !== null && (
                <div className="absolute inset-0 flex items-center justify-center z-30" style={{ backgroundColor: "rgba(5,18,64,0.92)" }}>
                    <div className="flex flex-col items-center gap-8 rounded-3xl border px-16 py-12" style={{ backgroundColor: "#051240", borderColor: accentColor, boxShadow: `0 0 40px ${accentColor}44` }}>
                        <span className="text-5xl font-bold tracking-wide" style={{ color: accentColor }}>
                            {winnerId === user?.id ? "Victoire !" : "Défaite..."}
                        </span>
                        <span className="text-xl text-white/80 tracking-wide">
                            {winnerId === user?.id
                                ? `Bravo ${user?.username ?? ""}, tu as gagné !`
                                : `${room?.users.find(u => u.id === winnerId)?.username ?? "L'adversaire"} a gagné.`}
                        </span>
                        <button
                            onClick={() => navigate(`/rooms/${id}`)}
                            className="px-16 py-3 rounded-2xl text-white text-base tracking-widest uppercase border cursor-pointer transition-all hover:opacity-80"
                            style={{ backgroundColor: "#051240", borderColor: accentColor, boxShadow: `0 0 16px ${accentColor}33` }}
                        >
                            Retour au salon
                        </button>
                    </div>
                </div>
            )}

            {/* Countdown overlay */}
            {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center z-20" style={{ backgroundColor: "rgba(5,18,64,0.85)" }}>
                    <span className="font-bold tabular-nums" style={{ color: accentColor, fontSize: "12rem", lineHeight: 1 }}>
                        {countdown}
                    </span>
                </div>
            )}

            <div className="absolute top-6 left-8 w-52">
                <ModalButton variant="danger" onClick={() => { socket.emit("game:quit", { roomId: id! }, () => {}); }}>
                    <span className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Quitter la partie
                    </span>
                </ModalButton>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 gap-10 px-16 py-24">
                <div className="flex w-full items-center justify-center gap-16">

                    {/* Mon avatar */}
                    <div className="flex flex-col items-center gap-3 w-48">
                        <div style={isMyTurn ? activeRingStyle : inactiveRingStyle}>
                            <div className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#051240" }}>
                                <img src={user?.imageName ?? "/src/assets/avatars/dog.png"} alt="avatar" className="w-3/4 h-3/4 object-contain" />
                            </div>
                        </div>
                        <span className="text-base font-semibold tracking-wide truncate max-w-full" style={{ color: isMyTurn ? accentColor : "#4E8098", opacity: isMyTurn ? 1 : 0.5 }}>
                            {user?.username ?? "Joueur 1"}
                        </span>
                        {!isMyTurn && (
                            <span className="text-xl font-bold tabular-nums" style={{ color: "#4E8098", opacity: 0.5 }}>
                                {formatTime(myTime)}
                            </span>
                        )}
                    </div>

                    {/* Timer central (joueur courant) */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="tabular-nums" style={{ color: accentColor, fontSize: "6rem", lineHeight: 1 }}>
                            {formatTime(isMyTurn ? myTime : opponentTime)}
                        </span>
                        <span className="text-xs tracking-widest uppercase" style={{ color: accentColor, opacity: 0.6 }}>
                            {isMyTurn ? `Tour de ${user?.username ?? "Joueur 1"}` : `Tour de ${opponent?.username ?? "Joueur 2"}`}
                        </span>
                    </div>

                    {/* Avatar adversaire */}
                    <div className="flex flex-col items-center gap-3 w-48">
                        <div style={!isMyTurn ? activeRingStyle : inactiveRingStyle}>
                            <div className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#051240" }}>
                                <img src={opponent?.imageName ?? "/src/assets/avatars/dog.png"} alt="avatar" className="w-3/4 h-3/4 object-contain" />
                            </div>
                        </div>
                        <span className="text-base font-semibold tracking-wide" style={{ color: !isMyTurn ? accentColor : "#4E8098", opacity: !isMyTurn ? 1 : 0.5 }}>
                            {opponent?.username ?? "Joueur 2"}
                        </span>
                        {isMyTurn && (
                            <span className="text-xl font-bold tabular-nums" style={{ color: "#4E8098", opacity: 0.5 }}>
                                {formatTime(opponentTime)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="w-full max-w-2xl rounded-2xl border px-10 py-8" style={{ backgroundColor: "#051240cc", borderColor: accentColor, boxShadow: `0 0 24px ${accentColor}22`, backdropFilter: "blur(6px)" }}>
                    <p className="text-center text-xl text-white/90 leading-relaxed tracking-wide">
                        {question?.label ?? '...'}
                    </p>
                </div>

                <div className="w-full max-w-xl flex flex-col items-center gap-6">
                    {answerResult && (
                        <div className="text-center text-lg font-semibold tracking-wide" style={{ color: answerResult.correct ? "#4caf50" : "#e53935" }}>
                            {answerResult.correct ? "Bonne réponse !" : `Mauvaise réponse — La bonne réponse était : ${answerResult.correctAnswer}`}
                        </div>
                    )}
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") submitAnswer(); }}
                        placeholder="Votre réponse..."
                        disabled={!isMyTurn || answerResult !== null}
                        className="w-full bg-transparent text-white text-xl text-center outline-none placeholder-white/30 pb-3 tracking-wide disabled:opacity-30"
                        style={{ borderBottom: "2px solid #DEB992" }}
                    />
                    <button
                        disabled={!isMyTurn || answerResult !== null}
                        onClick={submitAnswer}
                        className="px-16 py-3 rounded-2xl text-white text-base tracking-widest uppercase border transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        style={{ backgroundColor: "#051240", borderColor: "#DEB992", boxShadow: "0 0 16px #DEB99233" }}
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GamePage;