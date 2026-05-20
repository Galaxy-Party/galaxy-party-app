import type { RankDefinition } from '../../../utils/rank'

interface Props {
  rank: RankDefinition | null
  elo: number
  progress: number
  nextElo: number | null
}

/** Banner showing the player's current rank, progress towards the next rank and ELO. */
export default function RankBanner({ rank, elo, progress, nextElo }: Props) {
  return (
    <div className="rounded-[16px] px-[22px] py-5 border border-amber/30 bg-gradient-to-br from-amber/8 to-amber/2 flex items-center gap-[18px] mb-5">
      <div className="w-14 h-14 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-amber/20 to-amber/5 border-2 border-amber/40 shrink-0">
        <div className="text-[20px]">{rank?.icon ?? '🥉'}</div>
        <div className="font-display text-[9px] font-bold text-amber tracking-[0.1em]">{(rank?.name ?? '').substring(0, 4).toUpperCase()}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-[16px] text-amber">
          Rang actuel : {rank?.name ?? '—'}
        </div>
        <div className="text-[13px] text-text-dim mt-0.5">
          {rank?.next && nextElo !== null
            ? `+${nextElo - elo} pts pour progresser vers ${rank.next}`
            : rank ? 'Rang maximum atteint' : '—'}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1 rounded-[2px] bg-amber/15 overflow-hidden">
            <div className="h-full rounded-[2px] bg-gradient-to-r from-amber-deep to-amber transition-[width] duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-display text-[10px] text-text-dim whitespace-nowrap">{progress}%</span>
        </div>
      </div>
      <div className="font-display font-black text-[28px] text-amber ml-auto shrink-0 [text-shadow:0_0_16px_rgba(251,191,36,0.4)]">
        {elo}
      </div>
    </div>
  )
}
