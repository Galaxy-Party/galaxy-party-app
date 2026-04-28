import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserContext } from '../../hooks/useUserContext'
import { useSocket } from '../../hooks/useSocket'
import socket from '../../socket/client'
import type { Room } from '../../types/room/models'
import type { User } from '../../types/user/models'
import Starfield from '../../components/Starfield'
import ReturnMenuModal from '../../components/ReturnMenuModal'

const INDIGO = '#818cf8'
const ROSE = '#f472b6'
const BORDER = 'rgba(129,140,248,0.22)'
const PANEL = 'rgba(12,8,28,0.82)'
const TEXT_DIM = 'rgba(241,240,255,0.35)'
const NAVY = '#051240'

function Nebulae() {
  return (
    <>
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 700, height: 500, background: '#4f46e5', opacity: 0.14, top: -180, left: -120, animation: 'nf 18s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 600, height: 450, background: '#db2777', opacity: 0.10, bottom: -120, right: -80, animation: 'nf 18s ease-in-out infinite alternate', animationDelay: '-7s' }} />
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 450, height: 350, background: '#0d9488', opacity: 0.08, top: '30%', left: '38%', animation: 'nf 18s ease-in-out infinite alternate', animationDelay: '-13s' }} />
    </>
  )
}

export default function WaitingRoomPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useUserContext()
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [timer, setTimer] = useState(150000)
  const [isPrivate, setIsPrivate] = useState(false)
  const [password, setPassword] = useState('')
  const [room, setRoom] = useState<Room | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  }

  const emitUpdate = (patch: { timer?: number; password?: string }) => {
    if (!id) return
    socket.emit('room:update', { roomId: id, ...patch }, (err) => { if (err) console.error(err) })
  }

  useEffect(() => {
    if (!id) { navigate('/menu'); return }
    socket.emit('room:get', id, (err) => { if (err) navigate('/menu') })
  }, [id, navigate])

  const handleRoomDetails = useCallback((r: Room) => {
    if (user && !r.users.some(u => u.id === user.id)) { navigate('/menu'); return }
    setRoom(r)
    setIsPrivate(r.hasPassword)
    if (r.timer != null) setTimer(r.timer)
  }, [user, navigate])
  const handleUserJoined = useCallback((newUser: User) => {
    setRoom(prev => {
      if (!prev || prev.users.some(u => u.id === newUser.id)) return prev
      return { ...prev, users: [...prev.users, newUser] }
    })
  }, [])
  const handleUserLeft = useCallback((leftUserId: string) => {
    setRoom(prev => prev ? { ...prev, users: prev.users.filter(u => u.id !== leftUserId) } : prev)
  }, [])
  const handleOwnerChanged = useCallback((newOwnerId: string) => {
    setRoom(prev => prev ? { ...prev, ownerId: newOwnerId } : prev)
  }, [])
  const handleRoomDeleted = useCallback(() => navigate('/menu'), [navigate])
  const handleGameLoading = useCallback(() => navigate(`/rooms/${id}/game`), [navigate, id])

  useSocket('room:details', handleRoomDetails)
  useSocket('room:user_joined', handleUserJoined)
  useSocket('room:user_left', handleUserLeft)
  useSocket('room:owner_changed', handleOwnerChanged)
  useSocket('room:deleted', handleRoomDeleted)
  useSocket('game:loading', handleGameLoading)

  if (!room) return null

  const isOwner = user?.id === room.ownerId
  const owner = room.users.find(u => u.id === room.ownerId) ?? null
  const opponent = room.users.find(u => u.id !== room.ownerId) ?? null

  const handleLeave = () => {
    if (!id || !user) return
    socket.emit('room:leave', { roomId: id, userId: user.id }, (err) => {
      if (err) console.error(err)
      navigate('/menu')
    })
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#07050f', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <Starfield />
      <Nebulae />

      {/* Quit button */}
      <button
        onClick={() => room.users.length === 1 ? setShowReturnModal(true) : handleLeave()}
        style={{ position: 'absolute', top: 20, left: 28, zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 30, background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.3)', color: ROSE, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>Quitter le salon</span>
      </button>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 32px 0', flexShrink: 0 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'linear-gradient(90deg,#818cf8,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Galaxy Party
        </span>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px 24px' }}>
        <div className="card-in" style={{ width: '100%', maxWidth: 1100, background: PANEL, backdropFilter: 'blur(28px)', border: `1px solid ${BORDER}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
          {/* Card header */}
          <div style={{ padding: '22px 32px 16px', borderBottom: '1px solid rgba(129,140,248,0.12)', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: INDIGO }}>
              {room.name}
            </div>
          </div>

          {/* Card body */}
          <div style={{ padding: '28px 32px', display: 'flex', gap: 24 }}>
            {/* Players */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: INDIGO, marginBottom: 4 }}>
                Joueurs
              </div>
              {/* Owner row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, border: `1px solid ${BORDER}`, background: 'rgba(12,8,28,0.4)' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: NAVY, border: `2px solid ${INDIGO}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {owner && <img src={owner.imageName ?? undefined} alt="avatar" style={{ width: '72%', height: '72%', objectFit: 'contain' }} />}
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: '#f1f0ff' }}>{owner?.username}</div>
                  <div style={{ fontSize: 10, color: INDIGO, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Hôte</div>
                </div>
              </div>
              {/* Opponent row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, border: `1px solid ${BORDER}`, background: 'rgba(12,8,28,0.4)', opacity: opponent ? 1 : 0.45 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: NAVY, border: `2px solid ${opponent ? INDIGO : 'rgba(129,140,248,0.3)'}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {opponent ? (
                    <img src={opponent.imageName ?? undefined} alt="avatar" style={{ width: '72%', height: '72%', objectFit: 'contain' }} />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth="1.5" style={{ width: 26, height: 26 }}>
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: opponent ? '#f1f0ff' : TEXT_DIM }}>
                    {opponent ? opponent.username : "En attente d'un joueur…"}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(129,140,248,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Adversaire</div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div
              style={{ width: 280, flexShrink: 0, background: 'rgba(12,8,28,0.5)', border: `1px solid ${BORDER}`, borderRadius: 20, padding: '20px 22px', opacity: isOwner ? 1 : 0.5, pointerEvents: isOwner ? 'auto' : 'none' }}
            >
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: INDIGO, marginBottom: 18 }}>
                Paramètres
              </div>

              {/* Timer */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'rgba(241,240,255,0.72)' }}>Timer</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: INDIGO }}>{fmt(timer)}</span>
                </div>
                <input
                  type="range"
                  min={60000} max={300000} step={15000}
                  value={timer}
                  onChange={e => setTimer(Number(e.target.value))}
                  onMouseUp={e => emitUpdate({ timer: Number((e.target as HTMLInputElement).value) })}
                  onTouchEnd={e => emitUpdate({ timer: Number((e.target as HTMLInputElement).value) })}
                  style={{ width: '100%', accentColor: INDIGO, cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: TEXT_DIM }}>1:00</span>
                  <span style={{ fontSize: 9, color: TEXT_DIM }}>5:00</span>
                </div>
              </div>

              {/* Public/Privé */}
              <div>
                <div style={{ marginBottom: 8, fontSize: 13, color: 'rgba(241,240,255,0.72)' }}>Salon</div>
                <div style={{ display: 'flex', background: 'rgba(12,8,28,0.6)', borderRadius: 10, padding: 3, border: `1px solid ${BORDER}` }}>
                  <button
                    disabled={!isOwner}
                    onClick={() => { setIsPrivate(false); setPassword(''); emitUpdate({ password: '' }) }}
                    style={{ flex: 1, padding: '6px 12px', borderRadius: 8, border: 'none', background: !isPrivate ? 'rgba(129,140,248,0.2)' : 'transparent', cursor: isOwner ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: !isPrivate ? INDIGO : TEXT_DIM, transition: 'all 0.2s' }}
                  >
                    Public
                  </button>
                  <button
                    disabled={!isOwner}
                    onClick={() => setIsPrivate(true)}
                    style={{ flex: 1, padding: '6px 12px', borderRadius: 8, border: 'none', background: isPrivate ? 'rgba(129,140,248,0.2)' : 'transparent', cursor: isOwner ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: isPrivate ? INDIGO : TEXT_DIM, transition: 'all 0.2s' }}
                  >
                    Privé
                  </button>
                </div>
                {isPrivate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                    <input
                      type="text"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mot de passe…"
                      disabled={!isOwner}
                      style={{ flex: 1, background: 'rgba(129,140,248,0.06)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#f1f0ff', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }}
                    />
                    {isOwner && (
                      <button
                        onClick={() => emitUpdate({ password })}
                        style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${INDIGO}`, background: 'rgba(129,140,248,0.15)', color: INDIGO, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '20px 32px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(129,140,248,0.1)' }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: TEXT_DIM }}>
              {opponent ? '2 joueurs connectés' : "En attente d'un adversaire…"}
            </div>
            <button
              disabled={!isOwner || room.users.length < 2 || isStarting}
              onClick={() => {
                setIsStarting(true)
                socket.emit('game:start', { roomId: id!, userId: user!.id }, (err) => {
                  if (err) { console.error(err); setIsStarting(false) }
                })
              }}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 32px', height: 52, borderRadius: 41, background: 'rgba(79,70,229,0.15)', border: `1px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, cursor: (isOwner && room.users.length >= 2 && !isStarting) ? 'pointer' : 'not-allowed', transition: 'all 0.2s', opacity: (isOwner && room.users.length >= 2) ? 1 : 0.35 }}
            >
              {isStarting && (
                <svg style={{ width: 18, height: 18, animation: 'spin 0.8s linear infinite', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              )}
              {isStarting ? 'Lancement…' : 'Lancer la partie'}
            </button>
          </div>
        </div>
      </div>

      {showReturnModal && (
        <ReturnMenuModal
          onClose={() => setShowReturnModal(false)}
          onConfirm={handleLeave}
        />
      )}
    </div>
  )
}
