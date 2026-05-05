import { useEffect, useRef, useState } from 'react'
import socket from '../../socket/client'
import { useToast } from '../../hooks/useToast'
import type { ActiveChat, ChatMessage } from './types'
import FriendAvatar from './FriendAvatar'

interface Props {
  chat: ActiveChat
  myImageName: string | null | undefined
  onClose: () => void
  onMessageSent: (msg: ChatMessage) => void
}

export default function FriendChat({ chat, myImageName, onClose, onMessageSent }: Props) {
  const [msg, setMsg] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages])

  const send = () => {
    if (!msg.trim()) return
    const content = msg.trim()
    setMsg('')
    socket.emit('message:send', { toUserId: chat.userId, content }, (err, m) => {
      if (err) { toast.error(err); return }
      if (m) onMessageSent(m)
    })
  }

  return (
    <div className="border-t border-[rgba(129,140,248,0.22)] shrink-0">
      {/* Header */}
      <div className="flex items-center px-4 py-3">
        <FriendAvatar imageName={chat.imageName} size={28} />
        <span className="font-display text-sm font-semibold text-[#f1f0ff] flex-1 ml-[10px]">{chat.username}</span>
        <button onClick={onClose} className="text-[rgba(241,240,255,0.25)] hover:text-[#f472b6] transition-colors duration-200 shrink-0" title="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 px-[14px] pb-[10px] max-h-[200px] overflow-y-auto scrollbar-indigo">
        {chat.messages.map(m => (
          <div key={m.id} className={`flex gap-2 ${m.senderId !== chat.userId ? 'flex-row-reverse' : ''}`}>
            <FriendAvatar imageName={m.senderId === chat.userId ? chat.imageName : myImageName} size={24} />
            <div className={`max-w-[70%] px-3 py-2 text-[13px] leading-[1.5] ${
              m.senderId !== chat.userId
                ? 'bg-[rgba(79,70,229,0.2)] border border-[rgba(129,140,248,0.25)] text-[#f1f0ff] rounded-[14px_4px_14px_14px]'
                : 'bg-[rgba(129,140,248,0.1)] border border-[rgba(129,140,248,0.15)] text-[rgba(241,240,255,0.72)] rounded-[4px_14px_14px_14px]'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 px-[14px] pb-[14px] pt-[10px]">
        <input
          className="flex-1 bg-[rgba(129,140,248,0.06)] border border-[rgba(129,140,248,0.22)] rounded-xl px-[14px] py-[9px] text-[#f1f0ff] text-[13px] outline-none transition-all duration-200 placeholder:text-[rgba(241,240,255,0.35)] focus:border-[#818cf8]"
          placeholder="Message…"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={send} className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white flex items-center justify-center shrink-0 hover:opacity-85 transition-opacity duration-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
