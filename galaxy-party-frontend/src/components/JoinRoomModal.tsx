import { useState } from 'react'

const INDIGO = '#818cf8'
const BORDER = 'rgba(129,140,248,0.22)'

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
      style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card-in" style={{ background: 'rgba(12,8,28,0.96)', border: `1px solid ${BORDER}`, borderRadius: 24, padding: '36px 40px', minWidth: 380, maxWidth: 440, boxShadow: '0 24px 60px rgba(0,0,0,0.7)' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: INDIGO, marginBottom: 6 }}>
          {roomName}
        </div>
        {hasPassword ? (
          <>
            <div style={{ fontSize: 13, color: 'rgba(241,240,255,0.35)', marginBottom: 24 }}>
              Ce salon est protégé par un mot de passe.
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: INDIGO, marginBottom: 10, display: 'block' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && password && onJoin(password)}
                placeholder="Entrez le mot de passe…"
                autoFocus
                style={{ width: '100%', background: 'rgba(129,140,248,0.06)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '13px 18px', color: '#f1f0ff', fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: 'rgba(241,240,255,0.35)', marginBottom: 24 }}>
            Voulez-vous rejoindre ce salon ?
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            disabled={hasPassword && !password}
            onClick={() => onJoin(password)}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 32px', height: 52, borderRadius: 41, background: 'rgba(79,70,229,0.15)', border: `1px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, cursor: (!hasPassword || password) ? 'pointer' : 'default', transition: 'all 0.2s', opacity: (!hasPassword || password) ? 1 : 0.35 }}
          >
            Rejoindre
          </button>
          <button
            onClick={onClose}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', height: 44, alignSelf: 'center', borderRadius: 41, background: 'transparent', border: '1px solid rgba(241,240,255,0.15)', color: 'rgba(241,240,255,0.35)', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  )
}
