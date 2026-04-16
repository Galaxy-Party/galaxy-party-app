import {useLocation, useNavigate} from 'react-router-dom'
import backImg from '../assets/back.png'
import PrimaryButton from '../components/PrimaryButton'
import AvatarCircle from '../components/AvatarCircle'
import {useUserContext} from "../hooks/useUserContext.ts";

function MenuPage() {
    const {logout} = useUserContext();
    const navigate = useNavigate()
    const location = useLocation()
    const avatarIndex: number = location.state?.avatarIndex ?? 0

    return (
        <div
            className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
            style={{backgroundImage: `url(${backImg})`}}
        >
            <AvatarCircle avatarIndex={avatarIndex}/>

            <div className="flex flex-col items-center gap-5 mt-24">
                <PrimaryButton onClick={() => navigate('/create-room', {state: {avatarIndex}})}>
                    Créer un salon
                </PrimaryButton>
                <PrimaryButton onClick={() => navigate('/join-room', {state: {avatarIndex}})}>
                    Rejoindre un salon
                </PrimaryButton>
                <PrimaryButton onClick={() => navigate('/rules', {state: {avatarIndex}})}>
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
