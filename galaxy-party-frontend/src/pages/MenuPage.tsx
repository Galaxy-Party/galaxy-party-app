import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import backImg from '../assets/back.png'
import svgRaw from '../assets/avatars/vecteezy_vector-animals-dogs-cats-white-bears-pandas-rats-rabbits_6731369.svg?raw'

const viewBoxes = [
  '80 165 1000 1000',
  '1016 81 1000 1000',
  '1899 113 1000 1000',
  '108 1003 1000 1000',
  '1000 1037 1000 1000',
  '1896 1023 1000 1000',
  '92 1920 1000 1000',
  '962 1900 1000 1000',
  '1910 1896 1000 1000',
]

function MenuPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const avatarIndex: number = location.state?.avatarIndex ?? 0

  const avatarSvg = useMemo(() =>
    svgRaw.replace(
      'width="3000" height="3000" viewBox="0 0 3000 3000"',
      `width="100%" height="100%" viewBox="${viewBoxes[avatarIndex]}"`
    ),
    [avatarIndex]
  )

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: `url(${backImg})` }}
    >
      <div
        className="mt-28 w-48 h-48 rounded-full overflow-hidden border-2"
        style={{ backgroundColor: '#051240', borderColor: '#DEB992' }}
        dangerouslySetInnerHTML={{ __html: avatarSvg }}
      />

      <div className="flex flex-col items-center gap-12 mt-24">
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
          onClick={() => navigate('/rules')}
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
