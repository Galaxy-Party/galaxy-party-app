import { useEffect, useRef, useState } from 'react'
import socket from '../socket/client'
import { useSocket } from '../hooks/useSocket'
import { useUserContext } from '../hooks/useUserContext'
import type { FriendItem, FriendRequest, ChatMessage, FriendStatus } from '../types/sockets'

const STATUS_DOT: Record<FriendStatus, string> = {
  online:  'bg-[#34d399] shadow-[0_0_4px_#34d399]',
  ingame:  'bg-[#f59e0b] shadow-[0_0_4px_#f59e0b]',
  offline: 'bg-[rgba(241,240,255,0.2)]',
}
const STATUS_TEXT: Record<FriendStatus, string> = {
  online:  'text-[#34d399]',
  ingame:  'text-[#f59e0b]',
  offline: 'text-[rgba(241,240,255,0.35)]',
}
const STATUS_LABEL: Record<FriendStatus, string> = {
  online:  'En ligne',
  ingame:  'En partie',
  offline: 'Hors ligne',
}

function Avatar({ imageName, size = 42 }: { imageName?: string | null; size?: number }) {
  return (
    <div
      className="rounded-full bg-[#051240] border-2 border-[rgba(129,140,248,0.2)] overflow-hidden flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {imageName
        ? <img src={imageName} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
        : <svg viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth="1.5" width={size * 0.5} height={size * 0.5}>
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
      }
    </div>
  )
}

interface ActiveChat {
  userId: string
  username: string
  imageName: string | null
  messages: ChatMessage[]
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function FriendsPanel({ open, onClose }: Props) {
  const { user } = useUserContext()
  const [tab, setTab] = useState<'friends' | 'requests'>('friends')
  const [addVal, setAddVal] = useState('')
  const [friends, setFriends] = useState<FriendItem[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null)
  const [chatMsg, setChatMsg] = useState('')
  const [unreadFrom, setUnreadFrom] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useSocket('friend:list', ({ friends: f, requests: r }) => {
    setFriends(f)
    setRequests(r)
  })

  useSocket('friend:status', (userId, status) => {
    setFriends(prev => prev.map(f => f.id === userId ? { ...f, status } : f))
  })

  useSocket('friend:requested', (req) => {
    setRequests(prev => [...prev, req])
  })

  useSocket('message:received', (msg) => {
    setActiveChat(prev => {
      if (prev?.userId === msg.senderId) {
        return { ...prev, messages: [...prev.messages, msg] }
      }
      setUnreadFrom(s => new Set(s).add(msg.senderId))
      return prev
    })
  })

  useEffect(() => {
    if (activeChat) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChat, activeChat?.messages])

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

  const sendMsg = () => {
    if (!chatMsg.trim() || !activeChat) return
    socket.emit('message:send', { toUserId: activeChat.userId, content: chatMsg.trim() }, (_, msg) => {
      if (msg) setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev)
    })
    setChatMsg('')
  }

  const online  = friends.filter(f => f.status !== 'offline')
  const offline = friends.filter(f => f.status === 'offline')

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
        {([
          ['friends', `Amis (${online.length} en ligne)`],
          ['requests', `Demandes${requests.length > 0 ? ` (${requests.length})` : ''}`],
        ] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-[7px] border-0 bg-transparent text-[13px] font-medium border-b-2 transition-all duration-200 ${tab === t ? 'text-[#818cf8] border-b-[#818cf8]' : 'text-[rgba(241,240,255,0.35)] border-b-transparent'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-indigo">

        {tab === 'friends' && (
          <>
            {online.length > 0 && (
              <>
                <div className="font-display text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(241,240,255,0.35)] px-[7px] pt-[14px] pb-[6px]">
                  En ligne — {online.length}
                </div>
                {online.map(f => (
                  <div key={f.id} className="group flex items-center gap-3 p-[10px] rounded-[14px] cursor-pointer hover:bg-[rgba(129,140,248,0.06)] transition-all duration-200">
                    <div className="relative shrink-0">
                      <Avatar imageName={f.imageName} size={42} />
                      <span className={`absolute bottom-[1px] right-[1px] w-[10px] h-[10px] rounded-full border-2 border-[rgba(8,5,20,0.97)] ${STATUS_DOT[f.status]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm font-semibold text-[#f1f0ff]">{f.username}</div>
                      <div className={`text-xs mt-[1px] ${STATUS_TEXT[f.status]}`}>{STATUS_LABEL[f.status]}</div>
                    </div>
                    <div className="flex gap-1">
                      {f.status === 'online' && (
                        <button className="w-[30px] h-[30px] rounded-lg border border-[rgba(129,140,248,0.4)] bg-[rgba(129,140,248,0.08)] text-[rgba(241,240,255,0.7)] flex items-center justify-center hover:bg-[rgba(129,140,248,0.2)] hover:text-[#818cf8] hover:border-[#818cf8] transition-all duration-200" title="Inviter en partie">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                        </button>
                      )}
                      <button onClick={() => openChat(f)} className="relative w-[30px] h-[30px] rounded-lg border border-[rgba(129,140,248,0.4)] bg-[rgba(129,140,248,0.08)] text-[rgba(241,240,255,0.7)] flex items-center justify-center hover:bg-[rgba(129,140,248,0.2)] hover:text-[#818cf8] hover:border-[#818cf8] transition-all duration-200" title="Message">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                        </svg>
                        {unreadFrom.has(f.id) && (
                          <span className="absolute -top-[3px] -right-[3px] w-[8px] h-[8px] rounded-full bg-[#f472b6] shadow-[0_0_5px_#f472b6]" />
                        )}
                      </button>
                    </div>
                    {f.status === 'ingame' && (
                      <span className="text-[9px] font-bold bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)] rounded-[20px] px-2 py-[2px] whitespace-nowrap">
                        En jeu
                      </span>
                    )}
                  </div>
                ))}
              </>
            )}
            {offline.length > 0 && (
              <>
                <div className="font-display text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(241,240,255,0.35)] px-[7px] pt-4 pb-[6px]">
                  Hors ligne — {offline.length}
                </div>
                {offline.map(f => (
                  <div key={f.id} className="flex items-center gap-3 p-[10px] rounded-[14px] opacity-55">
                    <div className="relative shrink-0">
                      <Avatar imageName={f.imageName} size={42} />
                      <span className={`absolute bottom-[1px] right-[1px] w-[10px] h-[10px] rounded-full border-2 border-[rgba(8,5,20,0.97)] ${STATUS_DOT[f.status]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm font-semibold text-[#f1f0ff]">{f.username}</div>
                      <div className="text-xs mt-[1px] text-[rgba(241,240,255,0.35)]">{STATUS_LABEL[f.status]}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {friends.length === 0 && (
              <div className="py-7 text-center text-sm text-[rgba(241,240,255,0.35)]">Aucun ami pour le moment</div>
            )}
          </>
        )}

        {tab === 'requests' && (
          requests.length === 0 ? (
            <div className="py-7 text-center text-sm text-[rgba(241,240,255,0.35)]">Aucune demande en attente</div>
          ) : (
            <>
              <div className="font-display text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(241,240,255,0.35)] px-[7px] pt-[14px] pb-[6px]">
                Demandes reçues
              </div>
              {requests.map(r => (
                <div key={r.friendshipId} className="flex items-center gap-3 p-[10px] rounded-[14px]">
                  <Avatar imageName={r.imageName} size={42} />
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm font-semibold text-[#f1f0ff]">{r.username}</div>
                    <div className="text-xs mt-[1px] text-[rgba(241,240,255,0.35)]">Veut vous ajouter</div>
                  </div>
                  <div className="flex gap-[6px]">
                    <button onClick={() => acceptRequest(r.friendshipId)} className="px-3 py-[5px] rounded-lg border border-[rgba(52,211,153,0.4)] bg-[rgba(52,211,153,0.08)] text-[#34d399] text-xs font-semibold hover:bg-[rgba(52,211,153,0.18)] transition-all duration-200">✓</button>
                    <button onClick={() => declineRequest(r.friendshipId)} className="px-3 py-[5px] rounded-lg border border-[rgba(129,140,248,0.22)] bg-transparent text-[rgba(241,240,255,0.35)] text-xs hover:border-[rgba(244,114,182,0.3)] hover:text-[#f472b6] transition-all duration-200">✕</button>
                  </div>
                </div>
              ))}
            </>
          )
        )}
      </div>

      {activeChat && (
        <div className="border-t border-[rgba(129,140,248,0.22)] shrink-0">
          <div className="flex items-center px-4 py-3">
            <Avatar imageName={activeChat.imageName} size={28} />
            <span className="font-display text-sm font-semibold text-[#f1f0ff] flex-1 ml-[10px]">{activeChat.username}</span>
            <button
              onClick={() => setActiveChat(null)}
              className="text-[rgba(241,240,255,0.25)] hover:text-[#f472b6] transition-colors duration-200 shrink-0"
              title="Fermer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2 px-[14px] pb-[10px] max-h-[200px] overflow-y-auto scrollbar-indigo">
            {activeChat.messages.map(m => (
              <div key={m.id} className={`flex gap-2 ${m.senderId !== activeChat.userId ? 'flex-row-reverse' : ''}`}>
                <Avatar imageName={m.senderId === activeChat.userId ? activeChat.imageName : (user?.imageName ?? null)} size={24} />
                <div className={`max-w-[70%] px-3 py-2 text-[13px] leading-[1.5] ${
                  m.senderId !== activeChat.userId
                    ? 'bg-[rgba(79,70,229,0.2)] border border-[rgba(129,140,248,0.25)] text-[#f1f0ff] rounded-[14px_4px_14px_14px]'
                    : 'bg-[rgba(129,140,248,0.1)] border border-[rgba(129,140,248,0.15)] text-[rgba(241,240,255,0.72)] rounded-[4px_14px_14px_14px]'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2 px-[14px] pb-[14px] pt-[10px]">
            <input
              className="flex-1 bg-[rgba(129,140,248,0.06)] border border-[rgba(129,140,248,0.22)] rounded-xl px-[14px] py-[9px] text-[#f1f0ff] text-[13px] outline-none transition-all duration-200 placeholder:text-[rgba(241,240,255,0.35)] focus:border-[#818cf8]"
              placeholder="Message…"
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
            />
            <button onClick={sendMsg} className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white flex items-center justify-center shrink-0 hover:opacity-85 transition-opacity duration-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
