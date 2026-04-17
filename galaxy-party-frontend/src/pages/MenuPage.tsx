import {useNavigate} from 'react-router-dom'
import backImg from '../assets/back.png'
import PrimaryButton from '../components/PrimaryButton'
import AvatarCircle from '../components/AvatarCircle'
import {useUserContext} from "../hooks/useUserContext.ts";

function MenuPage() {
    const {logout, user} = useUserContext();
    const navigate = useNavigate()

    return (
        <div
            className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
            style={{backgroundImage: `url(${backImg})`}}
        >
            <AvatarCircle avatarFile={user?.imageName} className="mt-28"/>

            <div className="flex flex-col items-center gap-5 mt-24">
                <PrimaryButton onClick={() => navigate('/create-room')}>
                    Créer un salon
                </PrimaryButton>
                <PrimaryButton onClick={() => navigate('/rooms')}>
                    Rejoindre un salon
                </PrimaryButton>
                <PrimaryButton onClick={() => navigate('/rules')}>
                    Règles du jeu
                </PrimaryButton>
                <PrimaryButton onClick={() => logout()}>
                    Deconnexion
                </PrimaryButton>
            </div>
        </div>
    )
}

export default MenuPage
