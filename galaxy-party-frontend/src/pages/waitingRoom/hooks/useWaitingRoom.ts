import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import socket from '../../../socket/client'
import { useSocket } from '../../../hooks/useSocket'
import { useUserContext } from '../../../hooks/useUserContext'
import { useToast } from '../../../hooks/useToast'
import type { Room } from '../../../types/room/models'
import type { User } from '../../../types/user/models'

/** Owns the waiting-room session: room sync, owner-only settings, leave and start. */
export function useWaitingRoom() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useUserContext()
  const toast = useToast()

  const [room, setRoom] = useState<Room | null>(null)
  const [timer, setTimer] = useState(150000)
  const [isPrivate, setIsPrivate] = useState(false)
  const [password, setPassword] = useState('')
  const [isStarting, setIsStarting] = useState(false)

  const emitUpdate = useCallback((patch: { timer?: number; password?: string }) => {
    if (!id) return
    socket.emit('room:update', { roomId: id, ...patch }, (err) => { if (err) toast.error(err) })
  }, [id, toast])

  useEffect(() => {
    if (!id) { navigate('/menu'); return }
    socket.emit('room:get', id, (err) => { if (err) { toast.error(err); navigate('/menu') } })
  }, [id, navigate, toast])

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

  const leave = useCallback(() => {
    if (!id || !user) return
    socket.emit('room:leave', { roomId: id }, (err) => {
      if (err) toast.error(err)
      navigate('/menu')
    })
  }, [id, user, navigate, toast])

  const startGame = useCallback(() => {
    setIsStarting(true)
    socket.emit('game:start', { roomId: id!, timer }, (err) => {
      if (err) { toast.error(err); setIsStarting(false) }
    })
  }, [id, timer, toast])

  const isOwner = user?.id === room?.ownerId
  const owner = room?.users.find(u => u.id === room.ownerId) ?? null
  const opponent = room?.users.find(u => u.id !== room.ownerId) ?? null
  const canStart = !!isOwner && (room?.users.length ?? 0) >= 2

  return {
    room, isOwner, owner, opponent, canStart,
    timer, isPrivate, password, isStarting,
    setTimer,
    commitTimer: (ms: number) => emitUpdate({ timer: ms }),
    selectPublic: () => { setIsPrivate(false); setPassword(''); emitUpdate({ password: '' }) },
    selectPrivate: () => setIsPrivate(true),
    setPassword,
    savePassword: () => emitUpdate({ password }),
    leave,
    startGame,
  }
}
