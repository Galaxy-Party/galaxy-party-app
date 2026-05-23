import type { Room } from '../../../types/room/models'

interface Props {
  room: Room
  onSelect: () => void
}

/** A joinable room row: name, player count, lock icon and a join badge. */
export default function AvailableRoomRow({ room, onSelect }: Props) {
  const count = room.users?.length ?? 0
  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] border border-border bg-panel/40 cursor-pointer transition-all duration-200 hover:border-emerald/40 hover:bg-emerald/4"
    >
      <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_6px_var(--color-emerald)] shrink-0" />
      <span className="flex-1 text-[15px] font-semibold text-text">
        {room.name}
      </span>
      <span className={`font-display text-[12px] font-bold min-w-[32px] text-center ${count >= 1 ? 'text-rose/80' : 'text-text-dim'}`}>
        {count}/2
      </span>
      {room.hasPassword && (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="stroke-text-dim w-[13px] h-[13px]">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      )}
      <span className="font-display text-[11px] font-bold px-3.5 py-1 rounded-[20px] border border-emerald/35 text-emerald">
        Rejoindre
      </span>
    </div>
  )
}
