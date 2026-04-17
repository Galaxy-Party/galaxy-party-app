import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import backImg from "../../assets/back.png";
import HomeButton from "../../components/HomeButton.tsx";
import { useUserContext } from "../../hooks/useUserContext.ts";
import AvatarCircle from "../../components/AvatarCircle.tsx";
import { useSocket } from "../../hooks/useSocket.ts";
import socket from "../../socket/client.ts";
import type { Room } from "../../types/room/models.ts";
import type { User } from "../../types/user/models.ts";
import ReturnMenuModal from "../../components/ReturnMenuModal.tsx";

function WaitingRoomPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useUserContext();
    const [showReturnModal, setShowReturnModal] = useState(false)
    const [timer, setTimer] = useState(150)
    const [isPrivate, setIsPrivate] = useState(false)
    const [password, setPassword] = useState('')

    const formatTimer = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${m}:${sec.toString().padStart(2, '0')}`
    }

    const tickMarks = Array.from({ length: 17 }, (_, i) => 60 + i * 15)

    const [room, setRoom] = useState<Room | null>(null);

    useEffect(() => {
        if (!id) { navigate('/menu'); return; }
        socket.emit("room:get", id, (err) => {
            if (err) navigate('/menu');
        });
    }, [id, navigate]);

    const handleRoomDetails = useCallback((r: Room) => {
        setRoom(r)
        setIsPrivate(r.hasPassword)
    }, []);

    const handleUserJoined = useCallback((newUser: User) => {
        setRoom(prev => {
            if (!prev || prev.users.some(u => u.id === newUser.id)) return prev;
            return { ...prev, users: [...prev.users, newUser] };
        });
    }, []);

    const handleUserLeft = useCallback((leftUserId: string) => {
        setRoom(prev => {
            if (!prev) return prev;
            return { ...prev, users: prev.users.filter(u => u.id !== leftUserId) };
        });
    }, []);

    const handleOwnerChanged = useCallback((newOwnerId: string) => {
        setRoom(prev => prev ? { ...prev, ownerId: newOwnerId } : prev);
    }, []);

    const handleRoomDeleted = useCallback(() => navigate('/menu'), [navigate]);
    const handleGameLoading = useCallback(() => navigate(`/rooms/${id}/game`), [navigate, id]);

    useSocket("room:details", handleRoomDetails);
    useSocket("room:user_joined", handleUserJoined);
    useSocket("room:user_left", handleUserLeft);
    useSocket("room:owner_changed", handleOwnerChanged);
    useSocket("room:deleted", handleRoomDeleted);
    useSocket("game:loading", handleGameLoading);

    if (!room) return null;

    const isOwner = user?.id === room.ownerId;
    const opponent = room.users.find(u => u.id !== user?.id) ?? null;

    const handleLeave = () => {
        if (!id || !user) return;
        socket.emit("room:leave", { roomId: id, userId: user.id }, (err) => {
            if (err) console.error(err);
            navigate('/menu');
        });
    };

    const handleHomeClick = () => {
        if (room.users.length === 1) {
            setShowReturnModal(true);
        } else {
            handleLeave();
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center w-full min-h-screen bg-cover bg-center bg-no-repeat p-32"
            style={{backgroundImage: `url(${backImg})`}}
        >
            <HomeButton onClick={handleHomeClick} />

            <div
                className="flex flex-col w-full rounded-2xl border-2 p-10 gap-8"
                style={{ backgroundColor: '#051240', borderColor: '#DEB992'}}
            >
                <h1 className="text-center text-5xl font-bold" style={{ color: '#4E8098' }}>
                    {room.name}
                </h1>

                <div className="flex h-full" >
                    <div className="flex-col w-1/2 gap-8">
                        <div className="flex items-center gap-5">
                            <AvatarCircle avatarFile={user?.imageName}/>
                            <span className="text-2xl text-white">{user?.username}</span>
                        </div>

                        <div className={`flex items-center gap-5 mt-4 ${!opponent ? 'opacity-40' : ''}`}>
                            <AvatarCircle avatarFile={opponent?.imageName ?? null}/>
                            <span className="text-2xl text-white">
                                {opponent ? opponent.username : 'En attente...'}
                            </span>
                        </div>
                    </div>
                    <div className={`flex-col w-1/2 ${!isOwner ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                        <div
                            className="flex flex-col w-full h-full rounded-2xl border-2 px-10 py-5"
                            style={{ backgroundColor: '#051240', borderColor: '#DEB992'}}
                        >
                            <h3 className="text-center text-2xl mb-8 bold" style={{ color: '#4E8098' }}>
                                Paramètres
                            </h3>

                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg text-white">Timer</span>
                                        <span className="text-base tabular-nums" style={{ color: '#DEB992' }}>
                                            {formatTimer(timer)}
                                        </span>
                                    </div>
                                    <div className={`flex flex-col gap-1 ${!isOwner ? 'opacity-40 pointer-events-none' : ''}`}>
                                        <input
                                            type="range"
                                            min={60}
                                            max={300}
                                            step={15}
                                            value={timer}
                                            onChange={e => setTimer(Number(e.target.value))}
                                            className="w-full cursor-pointer accent-[#DEB992]"
                                        />
                                        <div className="flex justify-between px-0.5">
                                            {tickMarks.map(t => (
                                                <div key={t} className="flex flex-col items-center gap-0.5">
                                                    <div
                                                        className="w-px"
                                                        style={{
                                                            height: t % 60 === 0 ? '6px' : '3px',
                                                            backgroundColor: t === timer ? '#DEB992' : t % 60 === 0 ? 'rgba(222,185,146,0.4)' : 'rgba(78,128,152,0.35)',
                                                        }}
                                                    />
                                                    {t % 60 === 0 && (
                                                        <span style={{ fontSize: '8px', color: t === timer ? '#DEB992' : '#4E8098' }}>
                                                            {formatTimer(t)}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg text-white">Salon</span>
                                        <div className="flex items-center gap-1 rounded-xl p-0.5" style={{ backgroundColor: '#0a1f5c' }}>
                                            <button
                                                disabled={!isOwner}
                                                onClick={() => { setIsPrivate(false); setPassword('') }}
                                                className="px-3 py-1 rounded-lg text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                                                style={{
                                                    backgroundColor: !isPrivate ? '#DEB992' : 'transparent',
                                                    color: !isPrivate ? '#051240' : 'rgba(255,255,255,0.8)',
                                                    fontWeight: !isPrivate ? 600 : 400,
                                                }}
                                            >
                                                Public
                                            </button>
                                            <button
                                                disabled={!isOwner}
                                                onClick={() => setIsPrivate(true)}
                                                className="px-3 py-1 rounded-lg text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                                                style={{
                                                    backgroundColor: isPrivate ? '#DEB992' : 'transparent',
                                                    color: isPrivate ? '#051240' : 'rgba(255,255,255,0.8)',
                                                    fontWeight: isPrivate ? 600 : 400,
                                                }}
                                            >
                                                Privé
                                            </button>
                                        </div>
                                    </div>
                                    {isPrivate && (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                placeholder="Mot de passe..."
                                                disabled={!isOwner}
                                                className="flex-1 bg-transparent text-white text-sm outline-none pb-1 placeholder-white/30 disabled:opacity-40 disabled:cursor-not-allowed"
                                                style={{ borderBottom: '1px solid #DEB992' }}
                                            />
                                            {isOwner && (
                                                <button
                                                    className="px-3 py-1 rounded-lg text-sm font-semibold transition-opacity hover:opacity-70 cursor-pointer"
                                                    style={{ backgroundColor: '#DEB992', color: '#051240' }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"/>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        disabled={!isOwner || room.users.length < 2}
                        onClick={() => socket.emit('game:start', id!, (err) => { if (err) console.error(err); })}
                        className={`text-white text-lg px-20 py-3 rounded-2xl border-2 tracking-wide transition-opacity ${isOwner && room.users.length >= 2 ? 'cursor-pointer hover:opacity-70' : 'opacity-40 cursor-not-allowed'}`}
                        style={{ backgroundColor: '#051240', borderColor: '#DEB992' }}
                    >
                        Lancer la partie
                    </button>
                </div>
            </div>

            {showReturnModal && (
                <ReturnMenuModal
                    onClose={() => setShowReturnModal(false)}
                    onConfirm={handleLeave}
                />
            )}
        </div>
    )
}

export default WaitingRoomPage
