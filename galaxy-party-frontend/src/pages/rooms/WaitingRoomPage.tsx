import { useNavigate } from "react-router-dom";
import backImg from "../../assets/back.png";
import HomeButton from "../../components/HomeButton.tsx";
import { useUserContext } from "../../hooks/useUserContext.ts";
import AvatarCircle from "../../components/AvatarCircle.tsx";
import { useRoomContext } from "../../hooks/useRoomContext.ts";

function WaitingRoomPage() {
    const navigate = useNavigate();
    const { user } = useUserContext()
    const { room } = useRoomContext()

    if (!room) {
        navigate('/menu')
        return;
    }

    return (
        <div
            className="flex flex-col items-center justify-center w-full min-h-screen bg-cover bg-center bg-no-repeat p-32"
            style={{backgroundImage: `url(${backImg})`}}
        >
            <HomeButton onClick={() => navigate('/menu')} />
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

                        <div className="flex items-center gap-5 mt-4 opacity-40">
                            <AvatarCircle avatarFile={null}/>
                            <span className="text-2xl text-white">En attente...</span>
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
        </div>
    )
}

export default WaitingRoomPage
