import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../../../socket/client'
import { useSocket } from '../../../hooks/useSocket'
import { useUserContext } from '../../../hooks/useUserContext'
import { useToast } from '../../../hooks/useToast'
import type { Room } from '../../../types/room/models'

/** Creates a room and navigates its owner into the lobby once the server confirms. */
export function useCreateRoom() {
  const navigate = useNavigate()
  const { user } = useUserContext()
  const toast = useToast()

  useSocket('room:created', (room: Room) => {
    if (room.ownerId === user?.id) {
      navigate(`/rooms/${room.id}`, { state: { room } })
    }
  })

  const createRoom = useCallback((name: string, password: string) => {
    if (!name.trim() || !user) return
    socket.emit('room:create', { name: name.trim(), password: password || null }, (err?: string) => {
      if (err) toast.error(err)
    })
  }, [user, toast])

  return { createRoom }
}
