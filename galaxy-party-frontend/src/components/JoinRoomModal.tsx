import { useState } from 'react'
import TextButton from './TextButton'

interface JoinRoomModalProps {
  roomName: string
  hasPassword: boolean
  onClose: () => void
  onJoin: (password: string) => void
}

function JoinRoomModal({ roomName, hasPassword, onClose, onJoin }: JoinRoomModalProps) {
  const [password, setPassword] = useState('')

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-20"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div
        className="rounded-2xl border-2 p-10 flex flex-col items-center gap-6"
        style={{ backgroundColor: '#051240', borderColor: '#DEB992', minWidth: '420px' }}
      >
        <h2 className="text-3xl font-semibold" style={{ color: '#4E8098' }}>{roomName}</h2>

        {hasPassword && (
          <div className="flex flex-col items-center gap-3 w-full">
            <label className="text-white text-lg font-light">Entrez le mot de passe du salon :</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border-b-2 text-white text-center outline-none w-64 pb-2 text-lg"
              style={{ borderColor: '#DEB992', background: 'none' }}
            />
          </div>
        )}

        <div className="flex gap-8 mt-2">
          <TextButton onClick={onClose}>Retour</TextButton>
          <TextButton onClick={() => onJoin(password)}>Rejoindre</TextButton>
        </div>
      </div>
    </div>
  )
}

export default JoinRoomModal
