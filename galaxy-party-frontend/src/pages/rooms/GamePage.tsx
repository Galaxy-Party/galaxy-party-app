import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import backImg from "../../assets/back.png";
import { useUserContext } from "../../hooks/useUserContext.ts";
import ModalButton from "../../components/ModalButton.tsx";
import type { Room } from "../../types/room/models.ts";

type GameState = "player1" | "player2" | "wrong";

function GamePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useUserContext();
    const { state } = useLocation() as { state: { room: Room } };

    const room: Room | null = state?.room ?? null;
    const opponent = room?.users.find(u => u.id !== user?.id) ?? null;

    const [gameState] = useState<GameState>("player1");
    const [answer, setAnswer] = useState("");

    const isPlayer1Active = gameState === "player1";
    const isWrong = gameState === "wrong";

    const accentColor = isWrong ? "#a72d2d" : "#DEB992";

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
            <div className="absolute top-6 left-8 w-52">
                <ModalButton variant="danger" onClick={() => navigate(`/rooms/${id}`)}>
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
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
                    <div className="flex flex-col items-center gap-3 w-48">
                        <div style={isPlayer1Active ? activeRingStyle : inactiveRingStyle}>
                            <div
                                className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center"
                                style={{ backgroundColor: "#051240" }}
                            >
                                <img
                                    src={user?.imageName ?? "/src/assets/avatars/dog.png"}
                                    alt="avatar"
                                    className="w-3/4 h-3/4 object-contain"
                                />
                            </div>
                        </div>
                        <span
                            className="text-base font-semibold tracking-wide truncate max-w-full"
                            style={{ color: isPlayer1Active ? accentColor : "#4E8098", opacity: isPlayer1Active ? 1 : 0.5 }}
                        >
                            {user?.username ?? "Joueur 1"}
                        </span>

                        {!isPlayer1Active && (
                            <span className="text-xl font-bold" style={{ color: "#4E8098", opacity: 0.5 }}>
                                0:45
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span
                            className="tabular-nums"
                            style={{
                                color: accentColor,
                                fontSize: "6rem",
                                lineHeight: 1,
                            }}
                        >
                            1:30
                        </span>
                        <span className="text-xs tracking-widest uppercase" style={{ color: accentColor, opacity: 0.6 }}>
                            {isPlayer1Active ? "Tour de " + (user?.username ?? "Joueur 1") : "Tour de " + (opponent?.username ?? "Joueur 2")}
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-3 w-48">
                        <div style={!isPlayer1Active ? activeRingStyle : inactiveRingStyle}>
                            <div
                                className="w-44 h-44 rounded-full overflow-hidden flex items-center justify-center"
                                style={{ backgroundColor: "#051240" }}
                            >
                                <img
                                    src={opponent?.imageName ?? "/src/assets/avatars/dog.png"}
                                    alt="avatar"
                                    className="w-3/4 h-3/4 object-contain"
                                />
                            </div>
                        </div>
                        <span
                            className="text-base font-semibold tracking-wide"
                            style={{ color: !isPlayer1Active ? accentColor : "#4E8098", opacity: !isPlayer1Active ? 1 : 0.5 }}
                        >
                            {opponent?.username ?? "Joueur 2"}
                        </span>
                        {isPlayer1Active && (
                            <span className="text-xl font-bold" style={{ color: "#4E8098", opacity: 0.5 }}>
                                0:45
                            </span>
                        )}
                    </div>
                </div>
                <div
                    className="w-full max-w-2xl rounded-2xl border px-10 py-8"
                    style={{
                        backgroundColor: "#051240cc",
                        borderColor: accentColor,
                        boxShadow: `0 0 24px ${accentColor}22`,
                        backdropFilter: "blur(6px)",
                    }}
                >
                    <p className="text-center text-xl text-white/90 leading-relaxed tracking-wide">
                        Quelle est la capitale de la France ?
                    </p>
                </div>

                <div className="w-full max-w-xl flex flex-col items-center gap-6">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Votre réponse..."
                        className="w-full bg-transparent text-white text-xl text-center outline-none placeholder-white/30 pb-3 tracking-wide"
                        style={{ borderBottom: "2px solid #DEB992" }}
                    />

                    <button
                        className="px-16 py-3 rounded-2xl text-white text-base tracking-widest uppercase border cursor-pointer transition-all hover:opacity-80"
                        style={{
                            backgroundColor: "#051240",
                            borderColor: "#DEB992",
                            boxShadow: "0 0 16px #DEB99233",
                        }}
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GamePage;
