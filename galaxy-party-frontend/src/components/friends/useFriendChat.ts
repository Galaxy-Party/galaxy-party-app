import { useCallback, useState } from 'react'
import socket from '../../socket/client'
import { useSocket } from '../../hooks/useSocket'
import { useToast } from '../../hooks/useToast'
import type { FriendItem } from '../../types/sockets'
import type { ActiveChat } from './types'

/** Owns the open conversation, its messages, sending, and the unread indicators per friend. */
export function useFriendChat() {
  const toast = useToast()
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null)
  const [unread, setUnread] = useState<Set<string>>(new Set())

  useSocket('message:received', msg => {
    setActiveChat(prev => {
      if (prev?.userId === msg.senderId) return { ...prev, messages: [...prev.messages, msg] }
      setUnread(s => new Set(s).add(msg.senderId))
      return prev
    })
  })

  const openChat = useCallback((friend: FriendItem) => {
    setActiveChat({ userId: friend.id, username: friend.username, imageName: friend.imageName, messages: [] })
    setUnread(s => { const next = new Set(s); next.delete(friend.id); return next })
    socket.emit('message:get_history', { withUserId: friend.id }, (_, msgs) => {
      if (msgs) setActiveChat(prev => prev ? { ...prev, messages: msgs } : prev)
    })
  }, [])

  const closeChat = useCallback(() => setActiveChat(null), [])

  const sendMessage = useCallback((toUserId: string, content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return
    socket.emit('message:send', { toUserId, content: trimmed }, (err, msg) => {
      if (err) { toast.error(err); return }
      if (msg) setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev)
    })
  }, [toast])

  const hasUnread = useCallback((friendId: string) => unread.has(friendId), [unread])

  return { activeChat, openChat, closeChat, sendMessage, hasUnread }
}
