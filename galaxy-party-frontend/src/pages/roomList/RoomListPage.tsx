import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JoinRoomModal from '../../components/JoinRoomModal'
import type { Room } from '../../types/room/models'
import CardHeader from '../../components/CardHeader'
import RoomTab from './components/RoomTab'
import AvailableRoomRow from './components/AvailableRoomRow'
import InProgressRoomRow from './components/InProgressRoomRow'
import { useRoomList } from './hooks/useRoomList'

type Tab = 'available' | 'inProgress'

export default function RoomListPage() {
  const navigate = useNavigate()
  const { rooms, joinRoom } = useRoomList()
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

  const closeModal = () => setSelectedRoom(null)
  const handleJoin = (password: string) => {
    if (!selectedRoom) return
    joinRoom(selectedRoom, password, closeModal)
  }

  return (
    <>
    <div className="card-in fade-in w-full max-w-[1100px] bg-panel/82 backdrop-blur-[28px] border border-border rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

      {/* Title row */}
      <CardHeader
        title="Salons"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        }
        right={
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
            className="bg-indigo/6 border border-border rounded-[10px] px-3.5 py-2 text-text text-[14px] outline-none w-[200px]"
          />
        }
      />

      {/* Tabs */}
      <div className="flex justify-center border-b border-border gap-1 px-8">
        <RoomTab active={tab === 'available'} accent="emerald" label="Disponibles" count={joinableRooms.length} onClick={() => setTab('available')} />
        <RoomTab active={tab === 'inProgress'} accent="amber" label="En cours" count={inProgressRooms.length} onClick={() => setTab('inProgress')} />
      </div>

      {/* Content */}
      <div className="scrollbar-indigo px-8 pt-4 pb-7 max-h-[calc(100vh-300px)] overflow-y-auto flex flex-col gap-1.5">

        {tab === 'available' && (
          joinableRooms.length === 0
            ? <div className="text-center py-10 text-text-dim text-[15px]">Aucun salon disponible</div>
            : joinableRooms.map(room => (
                <AvailableRoomRow key={room.id} room={room} onSelect={() => setSelectedRoom(room)} />
              ))
        )}

        {tab === 'inProgress' && (
          inProgressRooms.length === 0
            ? <div className="text-center py-10 text-text-dim text-[15px]">Aucune partie en cours</div>
            : inProgressRooms.map(room => (
                <InProgressRoomRow key={room.id} room={room} onWatch={() => navigate(`/rooms/${room.id}/spectate`)} />
              ))
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
