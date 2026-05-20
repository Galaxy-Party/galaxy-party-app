import { useNavigate } from 'react-router-dom'
import socket from '../../socket/client'
import type { FriendItem } from '../../types/sockets'
import FriendAvatar from './FriendAvatar'
import { STATUS_DOT, STATUS_TEXT, STATUS_LABEL } from './types'

interface Props {
  friend: FriendItem
  hasUnread: boolean
  onOpenChat: (f: FriendItem) => void
}

export default function FriendRow({ friend: f, hasUnread, onOpenChat }: Props) {
  const navigate = useNavigate()
  const isOffline = f.status === 'offline'

  return (
    <div className={`flex items-center gap-3 p-[10px] rounded-[14px] transition-all duration-200 ${isOffline ? 'opacity-55' : 'hover:bg-[rgba(129,140,248,0.06)] cursor-pointer'}`}>
      <div className="relative shrink-0">
        <FriendAvatar imageName={f.imageName} size={42} />
        <span className={`absolute bottom-[1px] right-[1px] w-[10px] h-[10px] rounded-full border-2 border-[rgba(8,5,20,0.97)] ${STATUS_DOT[f.status]}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-display text-sm font-semibold text-[#f1f0ff] truncate">{f.username}</div>
        <div className={`text-xs mt-[1px] ${isOffline ? 'text-[rgba(241,240,255,0.35)]' : STATUS_TEXT[f.status]}`}>
          {STATUS_LABEL[f.status]}
        </div>
      </div>

      {!isOffline && (
        <div className="flex gap-1 shrink-0">
          {f.status === 'online' && (
            <button
              onClick={() => socket.emit('friend:invite', f.id, () => {})}
              className="w-[30px] h-[30px] rounded-lg border border-[rgba(129,140,248,0.4)] bg-[rgba(129,140,248,0.08)] text-[rgba(241,240,255,0.7)] flex items-center justify-center hover:bg-[rgba(129,140,248,0.2)] hover:text-[#818cf8] hover:border-[#818cf8] transition-all duration-200"
              title="Inviter en partie"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
          )}

          {f.status === 'inroom' && (
            <button
              disabled
              className="w-[30px] h-[30px] rounded-lg border border-[rgba(129,140,248,0.15)] bg-[rgba(129,140,248,0.04)] text-[rgba(241,240,255,0.2)] flex items-center justify-center cursor-not-allowed"
              title="Dans un salon"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
          )}

          {f.status === 'ingame' && f.roomId && (
            <button
              onClick={() => navigate(`/rooms/${f.roomId}/spectate`)}
              className="w-[30px] h-[30px] rounded-lg border border-[rgba(245,158,11,0.4)] bg-[rgba(245,158,11,0.08)] text-[#f59e0b] flex items-center justify-center hover:bg-[rgba(245,158,11,0.2)] hover:border-[#f59e0b] transition-all duration-200"
              title="Regarder la partie"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          )}

          <button
            onClick={() => onOpenChat(f)}
            className="relative w-[30px] h-[30px] rounded-lg border border-[rgba(129,140,248,0.4)] bg-[rgba(129,140,248,0.08)] text-[rgba(241,240,255,0.7)] flex items-center justify-center hover:bg-[rgba(129,140,248,0.2)] hover:text-[#818cf8] hover:border-[#818cf8] transition-all duration-200"
            title="Message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            {hasUnread && (
              <span className="absolute -top-[3px] -right-[3px] w-[8px] h-[8px] rounded-full bg-[#f472b6] shadow-[0_0_5px_#f472b6]" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
