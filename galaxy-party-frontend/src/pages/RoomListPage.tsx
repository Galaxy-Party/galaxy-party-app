import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JoinRoomModal from '../components/JoinRoomModal'
import { useUserContext } from '../hooks/useUserContext'
import { useSocket } from '../hooks/useSocket'
import socket from '../socket/client'
import type { Room } from '../types/room/models'

const EMERALD = '#34d399'
const AMBER = '#fbbf24'
const BORDER = 'rgba(129,140,248,0.22)'
const PANEL = 'rgba(12,8,28,0.82)'
const TEXT_DIM = 'rgba(241,240,255,0.35)'

type Tab = 'available' | 'inProgress'

export default function RoomListPage() {
  const navigate = useNavigate()
  const { user } = useUserContext()
  const [rooms, setRooms] = useState<Room[]>([])
  const [search, setSearch] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [tab, setTab] = useState<Tab>('available')

  const joinableRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) &&
    (r.users?.length ?? 0) < 2 &&
    !r.isInProgress
  )

  const inProgressRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) &&
    r.isInProgress
  )

  useEffect(() => {
    socket.emit('room:get_all', (err) => { if (err) console.error(err) })
  }, [])

  const handleRoomList = useCallback((roomList: Room[]) => setRooms(roomList), [])
  const handleRoomCreated = useCallback((room: Room) => setRooms(prev => [...prev, room]), [])
  const handleRoomDeleted = useCallback((roomId: string) => setRooms(prev => prev.filter(r => r.id !== roomId)), [])

  useSocket('room:list', handleRoomList)
  useSocket('room:created', handleRoomCreated)
  useSocket('room:deleted', handleRoomDeleted)

  const closeModal = () => setSelectedRoom(null)
  const handleJoin = (password: string) => {
    if (!selectedRoom || !user) return
    socket.emit('room:join', { roomId: selectedRoom.id, password }, (err) => {
      if (err) return console.error(err)
      navigate('/rooms/' + selectedRoom.id)
      closeModal()
    })
  }

  return (
    <>
    <div className="card-in fade-in" style={{ width: '100%', maxWidth: 1100, background: PANEL, backdropFilter: 'blur(28px)', border: `1px solid ${BORDER}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>

      {/* Title row */}
      <div style={{ padding: '20px 32px 16px', borderBottom: '1px solid rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '0.02em', color: '#f1f0ff' }}>
            Salons
          </span>
        </div>
        <input
          type="text"
          placeholder="Rechercher…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoComplete="off"
          style={{ background: 'rgba(129,140,248,0.06)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 14px', color: '#f1f0ff', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', width: 200 }}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', borderBottom: `1px solid ${BORDER}`, gap: 4, padding: '0 32px' }}>
        <button
          onClick={() => setTab('available')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: tab === 'available' ? `2px solid ${EMERALD}` : '2px solid transparent',
            marginBottom: -1,
            transition: 'all 0.18s',
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: EMERALD, boxShadow: tab === 'available' ? `0 0 6px ${EMERALD}` : 'none', transition: 'box-shadow 0.18s' }} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', color: tab === 'available' ? EMERALD : TEXT_DIM, transition: 'color 0.18s' }}>
            Disponibles
          </span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20, background: tab === 'available' ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.04)', color: tab === 'available' ? EMERALD : TEXT_DIM, transition: 'all 0.18s' }}>
            {joinableRooms.length}
          </span>
        </button>

        <button
          onClick={() => setTab('inProgress')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: tab === 'inProgress' ? `2px solid ${AMBER}` : '2px solid transparent',
            marginBottom: -1,
            transition: 'all 0.18s',
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: AMBER, boxShadow: tab === 'inProgress' ? `0 0 6px ${AMBER}` : 'none', transition: 'box-shadow 0.18s' }} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', color: tab === 'inProgress' ? AMBER : TEXT_DIM, transition: 'color 0.18s' }}>
            En cours
          </span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20, background: tab === 'inProgress' ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.04)', color: tab === 'inProgress' ? AMBER : TEXT_DIM, transition: 'all 0.18s' }}>
            {inProgressRooms.length}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="scrollbar-indigo" style={{ padding: '16px 32px 28px', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>

        {tab === 'available' && (
          joinableRooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: TEXT_DIM, fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>
              Aucun salon disponible
            </div>
          ) : (
            joinableRooms.map(room => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderRadius: 14, border: `1px solid ${BORDER}`, background: 'rgba(12,8,28,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(52,211,153,0.4)'
                  ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(52,211,153,0.04)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = BORDER
                  ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(12,8,28,0.4)'
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: EMERALD, boxShadow: `0 0 6px ${EMERALD}`, flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#f1f0ff' }}>
                  {room.name}
                </span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700, color: (room.users?.length ?? 0) >= 1 ? 'rgba(244,114,182,0.8)' : TEXT_DIM, minWidth: 32, textAlign: 'center' }}>
                  {room.users?.length ?? 0}/2
                </span>
                {room.hasPassword && (
                  <svg viewBox="0 0 24 24" fill="none" stroke={TEXT_DIM} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                )}
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20, border: `1px solid rgba(52,211,153,0.35)`, color: EMERALD }}>
                  Rejoindre
                </span>
              </div>
            ))
          )
        )}

        {tab === 'inProgress' && (
          inProgressRooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: TEXT_DIM, fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>
              Aucune partie en cours
            </div>
          ) : (
            inProgressRooms.map(room => (
              <div
                key={room.id}
                onClick={() => navigate(`/rooms/${room.id}/spectate`)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderRadius: 14, border: '1px solid rgba(251,191,36,0.18)', background: 'rgba(12,8,28,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(251,191,36,0.45)'
                  ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(251,191,36,0.05)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(251,191,36,0.18)'
                  ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(12,8,28,0.4)'
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: AMBER, boxShadow: `0 0 6px ${AMBER}`, flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#f1f0ff' }}>
                  {room.name}
                </span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700, color: 'rgba(251,191,36,0.65)' }}>
                  {room.users?.map(u => u.username).join(' vs ')}
                </span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20, border: `1px solid rgba(251,191,36,0.35)`, color: AMBER }}>
                  Regarder
                </span>
              </div>
            ))
          )
        )}

      </div>
    </div>

    {selectedRoom && (
      <JoinRoomModal
        roomName={selectedRoom.name}
        hasPassword={selectedRoom.hasPassword}
        onClose={closeModal}
        onJoin={handleJoin}
      />
    )}
    </>
  )
}