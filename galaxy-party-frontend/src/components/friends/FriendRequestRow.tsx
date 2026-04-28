import type { FriendRequest } from '../../types/sockets'
import FriendAvatar from './FriendAvatar'

interface Props {
  request: FriendRequest
  onAccept: (id: string) => void
  onDecline: (id: string) => void
}

export default function FriendRequestRow({ request: r, onAccept, onDecline }: Props) {
  return (
    <div className="flex items-center gap-3 p-[10px] rounded-[14px]">
      <FriendAvatar imageName={r.imageName} size={42} />
      <div className="flex-1 min-w-0">
        <div className="font-display text-sm font-semibold text-[#f1f0ff]">{r.username}</div>
        <div className="text-xs mt-[1px] text-[rgba(241,240,255,0.35)]">Veut vous ajouter</div>
      </div>
      <div className="flex gap-[6px]">
        <button
          onClick={() => onAccept(r.friendshipId)}
          className="px-3 py-[5px] rounded-lg border border-[rgba(52,211,153,0.4)] bg-[rgba(52,211,153,0.08)] text-[#34d399] text-xs font-semibold hover:bg-[rgba(52,211,153,0.18)] transition-all duration-200"
        >✓</button>
        <button
          onClick={() => onDecline(r.friendshipId)}
          className="px-3 py-[5px] rounded-lg border border-[rgba(129,140,248,0.22)] bg-transparent text-[rgba(241,240,255,0.35)] text-xs hover:border-[rgba(244,114,182,0.3)] hover:text-[#f472b6] transition-all duration-200"
        >✕</button>
      </div>
    </div>
  )
}
