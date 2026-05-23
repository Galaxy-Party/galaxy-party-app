import type { RankDefinition } from '../../../utils/rank'

interface Props {
  ranks: RankDefinition[]
  currentRankName?: string
  onClose: () => void
}

/** Modal listing every rank with its ELO range, highlighting the player's current rank. */
export default function RanksModal({ ranks, currentRankName, onClose }: Props) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[4px] flex items-center justify-center"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="card-in bg-panel/96 border border-border rounded-[24px] px-9 py-8 min-w-[360px] max-w-[420px] shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between mb-5">
          <span className="font-display font-bold text-[17px] text-text">Rangs</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-border bg-transparent text-text-dim flex items-center justify-center text-[13px] transition-all duration-200 hover:text-rose hover:border-rose/40"
          >✕</button>
        </div>
        <div className="flex flex-col gap-2">
          {ranks.map(r => {
            const isCurrentRank = currentRankName === r.name
            return (
              <div
                key={r.name}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] border"
                style={{ borderColor: isCurrentRank ? r.color : 'rgba(129,140,248,0.12)', background: isCurrentRank ? `${r.color}18` : 'rgba(12,8,28,0.4)' }}
              >
                <span className="text-[20px] w-7 text-center">{r.icon}</span>
                <div className="flex-1">
                  <div className="font-display font-bold text-[14px]" style={{ color: r.color }}>{r.name}</div>
                  <div className="text-[11px] text-text-dim mt-px">
                    {r.maxElo === null ? `${r.minElo}+ ELO` : `${r.minElo} – ${r.maxElo} ELO`}
                  </div>
                </div>
                {isCurrentRank && (
                  <div
                    className="font-display text-[10px] font-bold px-2.5 py-[3px] rounded-[20px] tracking-[0.06em] whitespace-nowrap border"
                    style={{ background: `${r.color}20`, borderColor: `${r.color}60`, color: r.color }}
                  >
                    Votre rang
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
