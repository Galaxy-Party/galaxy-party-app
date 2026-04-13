import { useNavigate, useLocation } from 'react-router-dom'
import backImg from '../assets/back.png'
import avatars from '../assets/avatars'

function MenuPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const avatarIndex: number = location.state?.avatarIndex ?? 0

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: `url(${backImg})` }}
    >
      <div
        className="mt-28 w-72 h-72 rounded-full overflow-hidden border-2 flex items-center justify-center"
        style={{ backgroundColor: '#051240', borderColor: '#DEB992' }}
      >
        <img src={avatars[avatarIndex]} alt="avatar" className="w-3/4 h-3/4 object-contain" />
      </div>

      <div className="flex flex-col items-center gap-5 mt-24">
        <button
          onClick={() => navigate('/create-room')}
          className="text-white text-2xl cursor-pointer border-2 rounded-[41px] tracking-wide"
          style={{ backgroundColor: '#051240', borderColor: '#DEB992', width: '340px', height: '75px' }}
        >
          Créer un salon
        </button>

        <button
          onClick={() => navigate('/join-room')}
          className="text-white text-2xl cursor-pointer border-2 rounded-[41px] tracking-wide"
          style={{ backgroundColor: '#051240', borderColor: '#DEB992', width: '340px', height: '75px' }}
        >
          Rejoindre un salon
        </button>

        <button
          onClick={() => navigate('/rules', { state: { avatarIndex } })}
          className="text-white text-2xl cursor-pointer border-2 rounded-[41px] tracking-wide"
          style={{ backgroundColor: '#051240', borderColor: '#DEB992', width: '340px', height: '75px' }}
        >
          Règles du jeu
        </button>
      </div>
    </div>
  )
}

export default MenuPage
