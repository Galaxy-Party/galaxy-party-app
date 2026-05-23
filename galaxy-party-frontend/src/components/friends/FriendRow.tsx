import { useNavigate } from 'react-router-dom'
import type { FriendItem } from '../../types/sockets'
import FriendAvatar from './FriendAvatar'
import { STATUS_DOT, STATUS_TEXT, STATUS_LABEL } from './types'

interface Props {
  friend: FriendItem
  hasUnread: boolean
  onOpenChat: (f: FriendItem) => void
  onInviteToGame: (friendId: string) => void
}

export default function FriendRow({ friend: f, hasUnread, onOpenChat, onInviteToGame }: Props) {
  const navigate = useNavigate()
  const isOffline = f.status === 'offline'

  return (
    <div className={`flex items-center gap-3 p-[10px] rounded-[14px] transition-all duration-200 ${isOffline ? 'opacity-55' : 'hover:bg-indigo/6 cursor-pointer'}`}>
      <div className="relative shrink-0">
        <FriendAvatar imageName={f.imageName} size={42} />
        <span className={`absolute bottom-[1px] right-[1px] w-[10px] h-[10px] rounded-full border-2 border-[rgba(8,5,20,0.97)] ${STATUS_DOT[f.status]}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-display text-sm font-semibold text-text truncate">{f.username}</div>
        <div className={`text-xs mt-[1px] ${isOffline ? 'text-text-dim' : STATUS_TEXT[f.status]}`}>
          {STATUS_LABEL[f.status]}
        </div>
      </div>

      {!isOffline && (
        <div className="flex gap-1 shrink-0">
          {f.status === 'online' && (
            <button
              onClick={() => onInviteToGame(f.id)}
              className="w-[30px] h-[30px] rounded-lg border border-indigo/40 bg-indigo/8 text-text/70 flex items-center justify-center hover:bg-indigo/20 hover:text-indigo hover:border-indigo transition-all duration-200"
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
              className="w-[30px] h-[30px] rounded-lg border border-indigo/15 bg-indigo/4 text-text/20 flex items-center justify-center cursor-not-allowed"
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
              className="w-[30px] h-[30px] rounded-lg border border-amber-deep/40 bg-amber-deep/8 text-amber-deep flex items-center justify-center hover:bg-amber-deep/20 hover:border-amber-deep transition-all duration-200"
              title="Regarder la partie"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          )}

          <button
            onClick={() => onOpenChat(f)}
            className="relative w-[30px] h-[30px] rounded-lg border border-indigo/40 bg-indigo/8 text-text/70 flex items-center justify-center hover:bg-indigo/20 hover:text-indigo hover:border-indigo transition-all duration-200"
            title="Message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            {hasUnread && (
              <span className="absolute -top-[3px] -right-[3px] w-[8px] h-[8px] rounded-full bg-rose shadow-[0_0_5px_var(--color-rose)]" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
