import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backImg from '../assets/back.png'
import HomeButton from '../components/HomeButton'
import PrimaryButton from '../components/PrimaryButton'
import AvatarCircle from '../components/AvatarCircle'
import { useRoomContext } from '../hooks/useRoomContext'
import { useUserContext } from '../hooks/useUserContext'

function RoomCreationPage() {
  const navigate = useNavigate()
  const { createRoom } = useRoomContext()
  const { user } = useUserContext()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleCreate = () => {
    if (!name.trim() || !user) return
    createRoom({ name: name.trim(), password: password || null, ownerId: user.id })
  }

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: `url(${backImg})` }}
    >
      <HomeButton onClick={() => navigate('/menu')} />

      <AvatarCircle avatarFile={user?.imageName} className="mt-28" />

      <div className="flex flex-col items-center gap-8 mt-10">
        <div className="flex flex-col items-center gap-3">
          <label className="text-white text-xl font-light">Entrez le nom du salon :</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border-b-2 text-white text-center outline-none w-72 pb-2 text-lg"
            style={{ borderColor: '#DEB992', background: 'none' }}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <label className="text-white text-xl font-light">Entrez le mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border-b-2 text-white text-center outline-none w-72 pb-2 text-lg"
            style={{ borderColor: '#DEB992', background: 'none' }}
          />
        </div>

        <PrimaryButton width="280px" height="65px" onClick={handleCreate}>
          Créer le salon
        </PrimaryButton>
      </div>
    </div>
  )
}

export default RoomCreationPage
