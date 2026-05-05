import { useEffect, useState } from 'react'
import socket from '../socket/client'
import { useSocket } from '../hooks/useSocket'
import { useUserContext } from '../hooks/useUserContext'
import type { FriendItem, FriendRequest } from '../types/sockets'
import type { ActiveChat } from './friends/types'
import FriendRow from './friends/FriendRow'
import FriendRequestRow from './friends/FriendRequestRow'
import FriendChat from './friends/FriendChat'

interface Props {
  open: boolean
  onClose: () => void
}

export default function FriendsPanel({ open, onClose }: Props) {
  const { user } = useUserContext()
  const [tab, setTab]         = useState<'friends' | 'requests'>('friends')
  const [addVal, setAddVal]   = useState('')
  const [friends, setFriends] = useState<FriendItem[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null)
  const [unreadFrom, setUnreadFrom] = useState<Set<string>>(new Set())

  useEffect(() => {
    socket.emit('friend:get_list', () => {})
  }, [])

  useSocket('friend:list', ({ friends: f, requests: r }) => {
    setFriends(f); setRequests(r)
  })

  useSocket('friend:status', (userId, status, roomId) => {
    setFriends(prev => prev.map(f => f.id === userId ? { ...f, status, roomId } : f))
  })

  useSocket('friend:requested', req => {
    setRequests(prev => [...prev, req])
  })

  useSocket('message:received', msg => {
    setActiveChat(prev => {
      if (prev?.userId === msg.senderId) return { ...prev, messages: [...prev.messages, msg] }
      setUnreadFrom(s => new Set(s).add(msg.senderId))
      return prev
    })
  })

  const sendRequest = () => {
    if (!addVal.trim()) return
    socket.emit('friend:request', addVal.trim(), () => {})
    setAddVal('')
  }

  const acceptRequest = (friendshipId: string) => {
    socket.emit('friend:accept', friendshipId, () => {
      setRequests(prev => prev.filter(r => r.friendshipId !== friendshipId))
    })
  }

  const declineRequest = (friendshipId: string) => {
    socket.emit('friend:decline', friendshipId, () => {
      setRequests(prev => prev.filter(r => r.friendshipId !== friendshipId))
    })
  }

  const openChat = (friend: FriendItem) => {
    setActiveChat({ userId: friend.id, username: friend.username, imageName: friend.imageName, messages: [] })
    setUnreadFrom(s => { const n = new Set(s); n.delete(friend.id); return n })
    socket.emit('message:get_history', { withUserId: friend.id }, (_, msgs) => {
      if (msgs) setActiveChat(prev => prev ? { ...prev, messages: msgs } : prev)
    })
  }

  const online  = friends.filter(f => f.status !== 'offline')
  const offline = friends.filter(f => f.status === 'offline')
  const sectionLabel = 'font-display text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(241,240,255,0.35)] px-[7px] pb-[6px]'

  return (
    <div className={`fixed top-0 right-0 bottom-0 w-[340px] z-30 bg-[rgba(8,5,20,0.97)] backdrop-blur-[28px] border-l border-[rgba(129,140,248,0.22)] flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}>

      <div className="flex items-center gap-3 px-5 pt-[22px] pb-4 border-b border-[rgba(129,140,248,0.22)] shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
          <path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.85"/>
        </svg>
        <span className="font-display font-bold text-[17px] text-[#f1f0ff] flex-1">Amis</span>
        {requests.length > 0 && <div className="w-2 h-2 rounded-full bg-[#f472b6] shadow-[0_0_6px_#f472b6]" />}
        <button onClick={onClose} className="w-8 h-8 rounded-full border border-[rgba(129,140,248,0.22)] bg-transparent flex items-center justify-center text-[rgba(241,240,255,0.35)] hover:bg-[rgba(244,114,182,0.1)] hover:text-[#f472b6] hover:border-[rgba(244,114,182,0.3)] transition-all duration-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="px-5 py-[14px] border-b border-[rgba(129,140,248,0.22)] shrink-0">
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 bg-[rgba(129,140,248,0.06)] border border-[rgba(129,140,248,0.22)] rounded-xl px-[14px] py-[10px] text-[#f1f0ff] text-sm outline-none transition-all duration-200 placeholder:text-[rgba(241,240,255,0.35)] focus:border-[#818cf8] focus:shadow-[0_0_0_2px_rgba(129,140,248,0.1)]"
            placeholder="Ajouter un ami par pseudo…"
            value={addVal}
            onChange={e => setAddVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendRequest()}
          />
          <button onClick={sendRequest} className="w-[38px] h-[38px] rounded-[10px] border border-[#818cf8] bg-[rgba(79,70,229,0.15)] text-[#818cf8] flex items-center justify-center shrink-0 hover:bg-[rgba(79,70,229,0.3)] transition-all duration-200">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex gap-1 px-5 pt-3 shrink-0">
        {(['friends', 'requests'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-[7px] border-0 bg-transparent text-[13px] font-medium border-b-2 transition-all duration-200 ${tab === t ? 'text-[#818cf8] border-b-[#818cf8]' : 'text-[rgba(241,240,255,0.35)] border-b-transparent'}`}>
            {t === 'friends' ? `Amis (${online.length} actifs)` : `Demandes${requests.length > 0 ? ` (${requests.length})` : ''}`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-indigo">
        {tab === 'friends' && (
          <>
            {online.length > 0 && (
              <>
                <div className={`${sectionLabel} pt-[14px]`}>Disponibles — {online.length}</div>
                {online.map(f => <FriendRow key={f.id} friend={f} hasUnread={unreadFrom.has(f.id)} onOpenChat={openChat} />)}
              </>
            )}
            {offline.length > 0 && (
              <>
                <div className={`${sectionLabel} pt-4`}>Hors ligne — {offline.length}</div>
                {offline.map(f => <FriendRow key={f.id} friend={f} hasUnread={false} onOpenChat={openChat} />)}
              </>
            )}
            {friends.length === 0 && (
              <div className="py-7 text-center text-sm text-[rgba(241,240,255,0.35)]">Aucun ami pour le moment</div>
            )}
          </>
        )}

        {tab === 'requests' && (
          requests.length === 0
            ? <div className="py-7 text-center text-sm text-[rgba(241,240,255,0.35)]">Aucune demande en attente</div>
            : <>
                <div className={`${sectionLabel} pt-[14px]`}>Demandes reçues</div>
                {requests.map(r => (
                  <FriendRequestRow key={r.friendshipId} request={r} onAccept={acceptRequest} onDecline={declineRequest} />
                ))}
              </>
        )}
      </div>

      {activeChat && (
        <FriendChat
          chat={activeChat}
          myImageName={user?.imageName}
          onClose={() => setActiveChat(null)}
          onMessageSent={msg => setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev)}
        />
      )}
    </div>
  )
}
