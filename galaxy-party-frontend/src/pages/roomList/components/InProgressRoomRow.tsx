import type { Room } from '../../../types/room/models'

interface Props {
  room: Room
  onWatch: () => void
}

/** An in-progress room row: name, the two players and a spectate badge. */
export default function InProgressRoomRow({ room, onWatch }: Props) {
  return (
    <div
      onClick={onWatch}
      className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] border border-amber/18 bg-panel/40 cursor-pointer transition-all duration-200 hover:border-amber/45 hover:bg-amber/5"
    >
      <div className="w-2 h-2 rounded-full bg-amber shadow-[0_0_6px_var(--color-amber)] shrink-0" />
      <span className="flex-1 text-[15px] font-semibold text-text">
        {room.name}
      </span>
      <span className="font-display text-[12px] font-bold text-amber/65">
        {room.users?.map(u => u.username).join(' vs ')}
      </span>
      <span className="font-display text-[11px] font-bold px-3.5 py-1 rounded-[20px] border border-amber/35 text-amber">
        Regarder
      </span>
    </div>
  )
}
