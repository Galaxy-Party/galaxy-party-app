interface Props {
  active: boolean
  accent: 'emerald' | 'amber'
  label: string
  count: number
  onClick: () => void
}

/** A tab header (status dot + label + count badge) for the room list. */
export default function RoomTab({ active, accent, label, count, onClick }: Props) {
  const isEmerald = accent === 'emerald'
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 -mb-px border-b-2 transition-all duration-[180ms] ${active ? (isEmerald ? 'border-b-emerald' : 'border-b-amber') : 'border-b-transparent'}`}>
      <div className={`w-[7px] h-[7px] rounded-full transition-shadow duration-[180ms] ${isEmerald ? 'bg-emerald' : 'bg-amber'} ${active ? (isEmerald ? 'shadow-[0_0_6px_var(--color-emerald)]' : 'shadow-[0_0_6px_var(--color-amber)]') : ''}`} />
      <span className={`font-display font-bold text-[13px] tracking-[0.04em] transition-colors duration-[180ms] ${active ? (isEmerald ? 'text-emerald' : 'text-amber') : 'text-text-dim'}`}>
        {label}
      </span>
      <span className={`font-display text-[11px] font-bold px-[7px] py-px rounded-[20px] transition-all duration-[180ms] ${active ? (isEmerald ? 'bg-emerald/12 text-emerald' : 'bg-amber/12 text-amber') : 'bg-white/4 text-text-dim'}`}>
        {count}
      </span>
    </button>
  )
}
