interface Props {
  imageName?: string | null
  name: string
  rankName: string
  elo: number
  /** Still looking for this slot's player (pulsing rings, no identity yet). */
  searching?: boolean
  /** An opponent has been found (emerald accent). */
  matched?: boolean
}

/** A matchmaking avatar: pulsing rings while searching, then the matched player's identity. */
export default function AvatarSlot({ imageName, name, rankName, elo, searching, matched }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 w-40">
      <div className="relative w-[100px] h-[100px]">
        {searching && (
          <>
            <div className="absolute -top-3 -right-3 -bottom-3 -left-3 rounded-full border-2 border-indigo/20 animate-[mmPulse_1.6s_ease-in-out_infinite]" />
            <div className="absolute -top-6 -right-6 -bottom-6 -left-6 rounded-full border border-indigo/10 animate-[mmPulse_1.6s_ease-in-out_infinite] [animation-delay:0.4s]" />
          </>
        )}
        <div className={`w-[100px] h-[100px] rounded-full bg-navy border-[3px] overflow-hidden flex items-center justify-center relative transition-[border-color,box-shadow] duration-500 ${searching ? 'border-indigo/30' : matched ? 'border-emerald shadow-[0_0_28px_rgba(52,211,153,0.3)]' : 'border-indigo shadow-[0_0_28px_rgba(129,140,248,0.3)]'}`}>
          {imageName
            ? <img src={imageName} alt="" className="w-[72%] h-[72%] object-contain" />
            : <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" width="44" height="44" className="stroke-indigo/40"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          }
        </div>
      </div>

      {searching ? (
        <div className="text-center">
          <div className="font-display font-semibold text-[15px] text-text-dim">Recherche…</div>
          <div className="flex gap-1 justify-center mt-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo/50 animate-[mmDot_1.2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="font-display font-bold text-[16px] text-text overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px]">{name}</div>
          <div className="text-[12px] text-text-dim mt-0.5">{rankName}</div>
          <div className="font-display font-bold text-[13px] text-amber mt-1">{elo} ELO</div>
        </div>
      )}
    </div>
  )
}
