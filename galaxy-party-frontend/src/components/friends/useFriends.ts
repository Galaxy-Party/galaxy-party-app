import { useCallback, useEffect, useState } from 'react'
import socket from '../../socket/client'
import { useSocket } from '../../hooks/useSocket'
import { useToast } from '../../hooks/useToast'
import type { FriendItem, FriendRequest } from '../../types/sockets'

/** Owns the friends roster + pending requests, their socket sync and the request actions. */
export function useFriends() {
  const toast = useToast()
  const [friends, setFriends] = useState<FriendItem[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    socket.emit('friend:get_list', () => {})
  }, [])

  useSocket('friend:list', ({ friends: f, requests: r }) => {
    setFriends(f)
    setRequests(r)
  })

  useSocket('friend:status', (userId, status, roomId) => {
    setFriends(prev => prev.map(f => f.id === userId ? { ...f, status, roomId } : f))
  })

  useSocket('friend:requested', req => {
    setRequests(prev => [...prev, req])
  })

  const sendRequest = useCallback((username: string, onSent: () => void) => {
    const value = username.trim()
    if (!value) return
    socket.emit('friend:request', value, (err?: string) => {
      if (err) { toast.error(err); return }
      onSent()
    })
  }, [toast])

  const acceptRequest = useCallback((friendshipId: string) => {
    socket.emit('friend:accept', friendshipId, (err?: string) => {
      if (err) { toast.error(err); return }
      setRequests(prev => prev.filter(r => r.friendshipId !== friendshipId))
    })
  }, [toast])

  const declineRequest = useCallback((friendshipId: string) => {
    socket.emit('friend:decline', friendshipId, (err?: string) => {
      if (err) { toast.error(err); return }
      setRequests(prev => prev.filter(r => r.friendshipId !== friendshipId))
    })
  }, [toast])

  const inviteToGame = useCallback((friendId: string) => {
    socket.emit('friend:invite', friendId, () => {})
  }, [])

  return { friends, requests, sendRequest, acceptRequest, declineRequest, inviteToGame }
}
