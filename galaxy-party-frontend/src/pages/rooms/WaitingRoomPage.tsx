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

    const [room, setRoom] = useState<Room | null>(null);

    useEffect(() => {
        if (!id) { navigate('/menu'); return; }
        socket.emit("room:get", id, (err) => {
            if (err) navigate('/menu');
        });
    }, [id, navigate]);

    const handleRoomDetails = useCallback((r: Room) => setRoom(r), []);

    const handleUserJoined = useCallback((newUser: User) => {
        setRoom(prev => {
            if (!prev || prev.users.some(u => u.id === newUser.id)) return prev;
            return { ...prev, users: [...prev.users, newUser] };
        });
    }, []);

    useSocket("room:details", handleRoomDetails);
    useSocket("room:user_joined", handleUserJoined);

    if (!room) return null;

    const opponent = room.users.find(u => u.id !== user?.id) ?? null;

    const handleHomeClick = () => {
        if (room.users.length === 1) {
            setShowReturnModal(true)
        } else {
            navigate('/menu')
        }
    }

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
                    <div className="flex-col w-1/2">
                        <div
                            className="flex flex-col w-full h-full rounded-2xl border-2 px-10 py-5"
                            style={{ backgroundColor: '#051240', borderColor: '#DEB992'}}
                        >
                            <h3 className="text-center text-2xl mb-8 bold" style={{ color: '#4E8098' }}>
                                Paramètres
                            </h3>

                            <div className="flex flex-col gap-5">
                                <div className="flex justify-between">
                                    <span className="text-lg text-white">Timer</span>
                                    <span className="text-lg text-white">2:30</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-lg text-white">Mot de passe</span>
                                    <span className="text-lg text-white">{room.hasPassword ? '********' : 'Aucun'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        className="text-white text-lg px-20 py-3 rounded-2xl cursor-pointer border-2 tracking-wide transition-opacity hover:opacity-70"
                        style={{ backgroundColor: '#051240', borderColor: '#DEB992' }}
                    >
                        Lancer la partie
                    </button>
                </div>
            </div>

            {showReturnModal && (
                <ReturnMenuModal
                    onClose={() => setShowReturnModal(false)}
                    onConfirm={() => {
                        socket.emit('room:delete', room.id, (err?: string) => {
                            if (err) console.error(err)
                        })
                        navigate('/menu')
                    }}
                />
            )}
        </div>
    )
}

export default WaitingRoomPage
