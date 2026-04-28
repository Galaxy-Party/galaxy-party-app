import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../hooks/useUserContext'
import { useSocket } from '../hooks/useSocket'
import socket from '../socket/client'
import type { Room } from '../types/room/models'

const INDIGO = '#818cf8'
const BORDER = 'rgba(129,140,248,0.22)'
const PANEL = 'rgba(12,8,28,0.82)'

export default function RoomCreationPage() {
  const navigate = useNavigate()
  const { user } = useUserContext()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [hasPassword, setHasPassword] = useState(false)

  useSocket('room:created', (room: Room) => {
    if (room.ownerId === user?.id) {
      navigate(`/rooms/${room.id}`, { state: { room } })
    }
  })

  const handleCreate = () => {
    if (!name.trim() || !user) return
    socket.emit('room:create', { name: name.trim(), password: password || null, ownerId: user.id }, (err?: string) => {
      if (err) console.error(err)
    })
  }

  return (
    <div className="card-in fade-in" style={{ width: '100%', maxWidth: 1100, background: PANEL, backdropFilter: 'blur(28px)', border: `1px solid ${BORDER}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
      <div style={{ padding: '20px 32px 16px', borderBottom: '1px solid rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
            <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </div>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '0.02em', color: '#f1f0ff' }}>
          Créer un salon
        </span>
      </div>

      <div style={{ padding: '28px 32px 32px' }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: INDIGO, marginBottom: 10, display: 'block' }}>
            Nom du salon
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Entrez le nom du salon"
            autoComplete="off"
            style={{ width: '100%', background: 'rgba(129,140,248,0.06)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '13px 18px', color: '#f1f0ff', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={hasPassword}
              onChange={e => { setHasPassword(e.target.checked); if (!e.target.checked) setPassword('') }}
              style={{ width: 16, height: 16, accentColor: INDIGO, cursor: 'pointer' }}
            />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(241,240,255,0.72)', fontWeight: 500 }}>
              Ajouter un mot de passe
            </span>
          </label>
          {hasPassword && (
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              style={{ width: '100%', background: 'rgba(129,140,248,0.06)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '13px 18px', color: '#f1f0ff', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, outline: 'none', boxSizing: 'border-box', marginTop: 12 }}
            />
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button
            disabled={!name.trim()}
            onClick={handleCreate}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 32px', height: 52, borderRadius: 41, background: 'rgba(79,70,229,0.15)', border: `1px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: '0.02em', cursor: name.trim() ? 'pointer' : 'default', transition: 'all 0.2s', boxShadow: '0 0 12px rgba(129,140,248,0.15)', opacity: name.trim() ? 1 : 0.35 }}
          >
            Créer le salon
          </button>
        </div>
      </div>
    </div>
  )
}
