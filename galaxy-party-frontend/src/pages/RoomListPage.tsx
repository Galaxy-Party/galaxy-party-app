import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import backImg from '../assets/back.png'
import avatars from '../assets/avatars'

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

function RoomListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const avatarIndex: number = location.state?.avatarIndex ?? 0
  const [search, setSearch] = useState('')

  const filtered = FAKE_ROOMS.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="w-full h-screen overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col items-center"
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

      <div
        className="mt-1 p-6"
        style={{ width: '60%' }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-white text-3xl">Liste des salons :</span>
          <input
            type="text"
            placeholder="Recherche"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-white text-2xl outline-none rounded-md px-3 py-1"
            style={{ backgroundColor: '#0a1f5c', borderColor: '#DEB992', border: '1px solid #DEB992', background: '#0a1f5c' }}
          />
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto scrollbar-gold pr-3" style={{ maxHeight: '300px' }}>
          {filtered.map(room => (
            <div
              key={room.id}
              className="flex items-center justify-between px-4 rounded-lg border"
              style={{ backgroundColor: '#051240', borderColor: '#DEB992', height: '52px' }}
            >
              <span className="text-white text-2xl font-bold">{room.name}</span>
              <button
                className="text-2xl font-bold cursor-pointer"
                style={{ color: '#4E8098', background: 'none', border: 'none' }}
              >
                Rejoindre
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoomListPage
