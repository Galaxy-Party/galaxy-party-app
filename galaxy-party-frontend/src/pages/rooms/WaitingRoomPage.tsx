import {useNavigate, useParams} from "react-router-dom";
import backImg from "../../assets/back.png";
import HomeButton from "../../components/HomeButton.tsx";
import {useUserContext} from "../../hooks/useUserContext.ts";
import AvatarCircle from "../../components/AvatarCircle.tsx";

const FAKE_ROOMS = [
    { id: 1, name: 'Kohaku' },
    { id: 2, name: 'Kiki' },
    { id: 3, name: 'Mika' },
    { id: 4, name: 'Spike' },
    { id: 5, name: 'Galaxy Party' },
    { id: 6, name: 'Nebula Squad' },
    { id: 7, name: 'StarDust' },
    { id: 8, name: 'Cosmic Crew' },
    { id: 9, name: 'Luna Party' },
    { id: 10, name: 'Orion' },
    { id: 11, name: 'Andromeda' },
    { id: 12, name: 'Nova Club' },
    { id: 13, name: 'Black Hole' },
    { id: 14, name: 'Supernova' },
    { id: 15, name: 'Pulsar' },
]

function WaitingRoomPage() {
    const {id} = useParams()
    const {user} = useUserContext()

    const navigate = useNavigate();
    const currentRoom = FAKE_ROOMS.find(r => r.id === Number(id))

    if (!currentRoom) {
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
                    {currentRoom.name}
                </h1>

                <div className="flex h-full" >
                    <div className="flex-col w-1/2 gap-8">
                        <div className="flex items-center gap-5">
                            <AvatarCircle avatarFile={user?.imageName}/>
                            <span className="text-2xl">{user?.username}</span>
                        </div>

                        <div className="flex items-center gap-5">
                            <AvatarCircle avatarFile={user?.imageName}/>
                            <span className="text-2xl">{user?.username}</span>
                        </div>
                    </div>
                    <div className="flex-col w-1/2">
                        <div
                            className="flex flex-col w-full h-full rounded-2xl border-2 px-10 py-5"
                            style={{ backgroundColor: '#051240', borderColor: '#DEB992'}}
                        >
                            <h3 className="text-center text-2xl mb-8 bold" style={{ color: '#4E8098' }}>
                                Paramètre
                            </h3>

                            <div className="flex flex-col gap-5">
                                <div className="flex justify-between">
                                    <span className="text-lg">Timer</span>
                                    <span className="text-lg">1:30</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-lg">Mot de passe</span>
                                    <span className="text-lg">********</span>
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
