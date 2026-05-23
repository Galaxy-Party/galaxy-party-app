import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../../../socket/client'
import { useSocket } from '../../../hooks/useSocket'
import { useUserContext } from '../../../hooks/useUserContext'
import { useToast } from '../../../hooks/useToast'
import type { Room } from '../../../types/room/models'

/** Keeps the rooms list in sync and joins a room (navigating into it on success). */
export function useRoomList() {
  const navigate = useNavigate()
  const { user } = useUserContext()
  const toast = useToast()
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    socket.emit('room:get_all', (err) => { if (err) toast.error(err) })
  }, [toast])

  const handleRoomList = useCallback((roomList: Room[]) => setRooms(roomList), [])
  const handleRoomCreated = useCallback((room: Room) => setRooms(prev => [...prev, room]), [])
  const handleRoomDeleted = useCallback((roomId: string) => setRooms(prev => prev.filter(r => r.id !== roomId)), [])

  useSocket('room:list', handleRoomList)
  useSocket('room:created', handleRoomCreated)
  useSocket('room:deleted', handleRoomDeleted)

  const joinRoom = useCallback((room: Room, password: string, onJoined: () => void) => {
    if (!user) return
    socket.emit('room:join', { roomId: room.id, password }, (err) => {
      if (err) { toast.error(err); return }
      navigate('/rooms/' + room.id)
      onJoined()
    })
  }, [user, navigate, toast])

  return { rooms, joinRoom }
}
