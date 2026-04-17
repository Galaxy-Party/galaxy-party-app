import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backImg from '../assets/back.png'
import HomeButton from '../components/HomeButton'
import TextButton from '../components/TextButton'
import AvatarCircle from '../components/AvatarCircle'
import JoinRoomModal from '../components/JoinRoomModal'
import {useUserContext} from "../hooks/useUserContext.ts";
import {useSocket} from "../hooks/useSocket.ts";
import socket from "../socket/client.ts";
import type {Room} from "../types/models.ts";

function RoomListPage() {
  const navigate = useNavigate()
  const {user} = useUserContext()

  const [rooms, setRooms] = useState<Room[]>([])
  const [search, setSearch] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

    const filtered = rooms.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    )

  useEffect(() => {
    socket.emit("room:get_all", (err) => {
      if (err) console.error(err);
    });
  }, []);

  const handleRoomList = useCallback((roomList: Room[]) => {
    setRooms(roomList);
  }, []);

  const handleRoomCreated = useCallback((room: Room) => {
    setRooms(prev => [...prev, room]);
  }, []);

  const handleRoomDeleted = useCallback((roomId: string) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
  }, []);

  useSocket("room:list", handleRoomList);
  useSocket("room:created", handleRoomCreated);
  useSocket("room:deleted", handleRoomDeleted);



  const closeModal = () => setSelectedRoom(null)
  const handleJoin = (password: string) => {
    if (!selectedRoom || !user) return;
    socket.emit("room:join", { roomId: selectedRoom.id, userId: user.id, password }, (err) => {
      if (err) return console.error(err);
      navigate('/rooms/' + selectedRoom.id);
      closeModal();
    });
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
            {
                filtered.length != 0 ?
                    filtered.map(room => (
                        <div
                            key={room.id}
                            className="flex items-center justify-between px-4 rounded-lg border"
                            style={{ backgroundColor: '#051240', borderColor: '#DEB992', height: '52px' }}
                        >
                            <span className="text-white text-2xl font-bold">{room.name}</span>
                            <TextButton onClick={() => setSelectedRoom(room)}>Rejoindre</TextButton>
                        </div>
                    ))
                    :
                    <div className="flex justify-center items-center mt-5">
                        <span className="text-white text-2xl bold">Aucun salon trouvé</span>
                    </div>

            }
          {}
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
    </div>
  )
}

export default RoomListPage
