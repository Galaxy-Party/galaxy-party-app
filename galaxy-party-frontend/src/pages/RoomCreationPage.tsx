import { useNavigate, useLocation } from 'react-router-dom'
import backImg from '../assets/back.png'
import avatars from '../assets/avatars'

function RoomCreationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const avatarIndex: number = location.state?.avatarIndex ?? 0

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: `url(${backImg})` }}
    >
      <button
        onClick={() => navigate('/menu', { state: { avatarIndex } })}
        className="absolute left-6 top-8 cursor-pointer"
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L2 10H5V20H10V14H14V20H19V10H22L12 3Z" stroke="#DEB992" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
          <circle cx="12" cy="10" r="1.5" fill="#DEB992"/>
        </svg>
      </button>

      <div
        className="mt-28 w-72 h-72 rounded-full overflow-hidden border-2 flex items-center justify-center"
        style={{ backgroundColor: '#051240', borderColor: '#DEB992' }}
      >
        <img src={avatars[avatarIndex]} alt="avatar" className="w-3/4 h-3/4 object-contain" />
      </div>

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

        <button
          className="text-white text-xl cursor-pointer border-2 rounded-[41px] tracking-wide mt-4"
          style={{ backgroundColor: '#051240', borderColor: '#DEB992', width: '280px', height: '65px' }}
        >
          Créer le salon
        </button>

      </div>
    </div>
  )
}

export default RoomCreationPage
