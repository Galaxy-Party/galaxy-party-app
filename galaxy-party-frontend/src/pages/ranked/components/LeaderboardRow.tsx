interface Props {
  label: string
  /** CSS color for the position label (medal/rank tints come from theme tokens). */
  labelColor: string
  imageName?: string | null
  name: string
  elo: number
  highlighted: boolean
}

/** A single leaderboard entry: position, avatar, name and ELO. */
export default function LeaderboardRow({ label, labelColor, imageName, name, elo, highlighted }: Props) {
  return (
    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] ${highlighted ? 'border border-indigo/40 bg-indigo/6' : 'border border-border bg-panel/40'}`}>
      <div className="font-display text-[13px] font-bold w-6 text-center" style={{ color: labelColor }}>
        {label}
      </div>
      <div className="w-8 h-8 rounded-full bg-navy border border-indigo/25 overflow-hidden flex items-center justify-center shrink-0">
        {imageName
          ? <img src={imageName} alt="" className="w-3/4 h-3/4 object-contain" />
          : <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" width="16" height="16" className="stroke-indigo/40"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        }
      </div>
      <div className="flex-1 text-[14px] font-semibold text-text overflow-hidden text-ellipsis whitespace-nowrap">
        {name}
      </div>
      <div className="font-display text-[13px] font-bold text-amber shrink-0">
        {elo}
      </div>
    </div>
  )
}
