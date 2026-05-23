import { useState } from 'react'
import CardHeader from '../../components/CardHeader'
import { useCreateRoom } from './hooks/useCreateRoom'

export default function RoomCreationPage() {
  const { createRoom } = useCreateRoom()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [hasPassword, setHasPassword] = useState(false)

  const handleCreate = () => createRoom(name, password)

  return (
    <div className="card-in fade-in w-full max-w-[1100px] bg-panel/82 backdrop-blur-[28px] border border-border rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
      <CardHeader
        title="Créer un salon"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        }
      />

      <div className="px-8 pt-7 pb-8">
        <div className="mb-5">
          <label className="block font-display text-[11px] font-semibold tracking-[0.15em] uppercase text-indigo mb-2.5">
            Nom du salon
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Entrez le nom du salon"
            autoComplete="off"
            className="w-full bg-indigo/6 border border-border rounded-[12px] px-[18px] py-[13px] text-text text-[15px] font-medium outline-none box-border"
          />
        </div>

        <div className="mb-5">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={hasPassword}
              onChange={e => { setHasPassword(e.target.checked); if (!e.target.checked) setPassword('') }}
              className="w-4 h-4 cursor-pointer accent-indigo"
            />
            <span className="text-[15px] text-text/72 font-medium">
              Ajouter un mot de passe
            </span>
          </label>
          {hasPassword && (
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full bg-indigo/6 border border-border rounded-[12px] px-[18px] py-[13px] text-text text-[15px] font-medium outline-none box-border mt-3"
            />
          )}
        </div>

        <div className="flex gap-2.5 mt-[22px]">
          <button
            disabled={!name.trim()}
            onClick={handleCreate}
            className="inline-flex items-center justify-center px-8 h-13 rounded-[41px] bg-indigo-deep/15 border border-indigo text-text font-display text-[15px] font-semibold tracking-[0.02em] transition-all duration-200 shadow-[0_0_12px_rgba(129,140,248,0.15)] disabled:opacity-35 disabled:cursor-default"
          >
            Créer le salon
          </button>
        </div>
      </div>
    </div>
  )
}
