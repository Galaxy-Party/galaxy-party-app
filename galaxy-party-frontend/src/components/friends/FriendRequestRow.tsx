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
        <div className="font-display text-sm font-semibold text-text truncate">{r.username}</div>
        <div className="text-xs mt-[1px] text-text-dim">Veut vous ajouter</div>
      </div>
      <div className="flex gap-[6px]">
        <button
          onClick={() => onAccept(r.friendshipId)}
          className="px-3 py-[5px] rounded-lg border border-emerald/40 bg-emerald/8 text-emerald text-xs font-semibold hover:bg-emerald/18 transition-all duration-200"
        >✓</button>
        <button
          onClick={() => onDecline(r.friendshipId)}
          className="px-3 py-[5px] rounded-lg border border-border bg-transparent text-text-dim text-xs hover:border-rose/30 hover:text-rose transition-all duration-200"
        >✕</button>
      </div>
    </div>
  )
}
