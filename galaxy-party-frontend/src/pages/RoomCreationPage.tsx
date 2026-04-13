import { useNavigate, useLocation } from 'react-router-dom'
import backImg from '../assets/back.png'
import HomeButton from '../components/HomeButton'
import PrimaryButton from '../components/PrimaryButton'
import AvatarCircle from '../components/AvatarCircle'

function RoomCreationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const avatarIndex: number = location.state?.avatarIndex ?? 0

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: `url(${backImg})` }}
    >
      <HomeButton onClick={() => navigate('/menu', { state: { avatarIndex } })} />

      <AvatarCircle avatarIndex={avatarIndex} />

      <div className="flex flex-col items-center gap-8 mt-10">
        <div className="flex flex-col items-center gap-3">
          <label className="text-white text-xl font-light">Entrez le nom du salon :</label>
          <input
            type="text"
            className="border-b-2 text-white text-center outline-none w-72 pb-2 text-lg"
            style={{ borderColor: '#DEB992', background: 'none' }}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <label className="text-white text-xl font-light">Entrez le mot de passe :</label>
          <input
            type="password"
            className="border-b-2 text-white text-center outline-none w-72 pb-2 text-lg"
            style={{ borderColor: '#DEB992', background: 'none' }}
          />
        </div>

        <PrimaryButton width="280px" height="65px">
          Créer le salon
        </PrimaryButton>
      </div>
    </div>
  )
}

export default RoomCreationPage
