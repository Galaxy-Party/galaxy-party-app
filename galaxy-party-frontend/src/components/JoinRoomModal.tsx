import { useState } from 'react'

interface JoinRoomModalProps {
  roomName: string
  hasPassword: boolean
  onClose: () => void
  onJoin: (password: string) => void
}

export default function JoinRoomModal({ roomName, hasPassword, onClose, onJoin }: JoinRoomModalProps) {
  const [password, setPassword] = useState('')

  return (
    <div
      className="fixed inset-0 z-20 bg-black/60 backdrop-blur-[4px] flex items-center justify-center"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card-in bg-panel/96 border border-border rounded-[24px] px-10 py-9 min-w-[380px] max-w-[440px] shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
        <div className="font-display font-bold text-[20px] text-indigo mb-1.5">
          {roomName}
        </div>
        {hasPassword ? (
          <>
            <div className="text-[13px] text-text-dim mb-6">
              Ce salon est protégé par un mot de passe.
            </div>
            <div className="mb-5">
              <label className="block font-display text-[11px] font-semibold tracking-[0.15em] uppercase text-indigo mb-2.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && password && onJoin(password)}
                placeholder="Entrez le mot de passe…"
                autoFocus
                className="w-full bg-indigo/6 border border-border rounded-[12px] px-[18px] py-[13px] text-text text-[15px] outline-none box-border"
              />
            </div>
          </>
        ) : (
          <div className="text-[13px] text-text-dim mb-6">
            Voulez-vous rejoindre ce salon ?
          </div>
        )}
        <div className="flex gap-2.5 mt-2">
          <button
            disabled={hasPassword && !password}
            onClick={() => onJoin(password)}
            className="inline-flex items-center justify-center px-8 h-13 rounded-[41px] bg-indigo-deep/15 border border-indigo text-text font-display text-[15px] font-semibold transition-all duration-200 disabled:opacity-35 disabled:cursor-default"
          >
            Rejoindre
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-6 h-11 self-center rounded-[41px] bg-transparent border border-text/15 text-text-dim text-[14px] font-medium transition-all duration-200"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  )
}
