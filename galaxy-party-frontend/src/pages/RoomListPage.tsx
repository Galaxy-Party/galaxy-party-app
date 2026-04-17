import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backImg from '../assets/back.png'
import HomeButton from '../components/HomeButton'
import TextButton from '../components/TextButton'
import AvatarCircle from '../components/AvatarCircle'
import JoinRoomModal from '../components/JoinRoomModal'
import {useUserContext} from "../hooks/useUserContext.ts";

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
    const {user} = useUserContext()

  const [search, setSearch] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<{ id: number; name: string } | null>(null)

  const filtered = FAKE_ROOMS.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  const closeModal = () => setSelectedRoom(null)
  const handleJoin = () => {
      navigate('/rooms/' + selectedRoom?.id)
    closeModal()
  }

  return (
    <div
      className="w-full h-screen overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: `url(${backImg})` }}
    >
      <HomeButton onClick={() => navigate('/menu')} />

      <AvatarCircle avatarFile={user?.imageName} className="mt-28" />

      <div className="mt-1 p-6" style={{ width: '60%' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-white text-3xl">Liste des salons :</span>
          <input
              autoComplete="off"
                type="text"
                placeholder="Recherche"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-white text-2xl outline-none rounded-md px-3 py-1"
                style={{ backgroundColor: '#0a1f5c', border: '1px solid #DEB992' }}
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
              <TextButton onClick={() => setSelectedRoom(room)}>Rejoindre</TextButton>
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <JoinRoomModal
          roomName={selectedRoom.name}
          onClose={closeModal}
          onJoin={handleJoin}
        />
      )}
    </div>
  )
}

export default RoomListPage
