import { useUserContext } from '../../hooks/useUserContext'
import { useRanks } from '../../hooks/useRanks'
import Starfield from '../../components/Starfield'
import Nebulae from '../../components/Nebulae'
import { getRankInfo } from '../../utils/rank'
import AvatarSlot from './components/AvatarSlot'
import { useMatchmaking } from './hooks/useMatchmaking'

export default function MatchmakingPage() {
  const { user } = useUserContext()
  const ranks = useRanks()
  const { elapsed, phase, countdown, opponent, cancel } = useMatchmaking()

  const myElo = user?.elo ?? 0
  const myRank = getRankInfo(myElo, ranks)
  const oppRank = opponent ? getRankInfo(opponent.elo, ranks) : null

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const isSearching = phase === 'searching'
  const isMatched = phase === 'found' || phase === 'countdown'

  return (
    <div className="fixed inset-0 z-[5] flex flex-col items-center justify-center">
      <style>{`
        @keyframes mmPulse { 0%,100%{opacity:0.6;transform:scale(1);} 50%{opacity:0.1;transform:scale(1.12);} }
        @keyframes mmDot   { 0%,100%{transform:translateY(0);opacity:0.4;} 50%{transform:translateY(-5px);opacity:1;} }
        @keyframes mmVs    { from{opacity:0;transform:scale(0.6);} to{opacity:1;transform:scale(1);} }
      `}</style>
      <Starfield />
      <Nebulae />

      {/* Card */}
      <div className="relative z-[1] bg-panel/82 backdrop-blur-[28px] border border-border rounded-[28px] px-[52px] pt-12 pb-11 flex flex-col items-center gap-9 shadow-[0_32px_80px_rgba(0,0,0,0.6)] min-w-[460px] animate-[cardIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">

        <div className="text-center">
          <div className="font-display font-bold text-[13px] tracking-[0.18em] uppercase text-amber mb-1.5">
            ⭐ Mode Classé
          </div>
          {isSearching && (
            <div className="font-display font-bold text-[22px] text-text">
              Recherche d'un adversaire…
            </div>
          )}
          {isMatched && (
            <div className="font-display font-bold text-[22px] text-emerald animate-[cardIn_0.3s_ease_forwards]">
              Adversaire trouvé !
            </div>
          )}
        </div>

        <div className="flex items-center gap-9">
          <AvatarSlot
            imageName={user?.imageName}
            name={user?.username ?? ''}
            rankName={myRank?.name ?? ''}
            elo={myElo}
            matched={isMatched}
          />

          <div className="flex flex-col items-center gap-2">
            {phase === 'countdown' ? (
              <div
                key={countdown}
                className="font-display font-black text-[52px] text-indigo leading-none animate-[mmVs_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards] [text-shadow:0_0_32px_rgba(129,140,248,0.5)]"
              >
                {countdown}
              </div>
            ) : (
              <div className="font-display font-black text-[28px] text-indigo/40 tracking-[0.05em]">
                VS
              </div>
            )}
          </div>

          {isSearching ? (
            <AvatarSlot name="" rankName="" elo={0} searching />
          ) : (
            <AvatarSlot
              imageName={opponent?.imageName}
              name={opponent?.username ?? ''}
              rankName={oppRank?.name ?? ''}
              elo={opponent?.elo ?? 0}
              matched={isMatched}
            />
          )}
        </div>

        {isSearching && (
          <div className="text-center">
            <div className="font-display font-bold text-[32px] text-indigo tracking-[0.1em]">
              {fmt(elapsed)}
            </div>
            <div className="text-[12px] text-text-dim mt-1 tracking-[0.1em] uppercase">
              Temps de recherche
            </div>
          </div>
        )}
        {isMatched && (
          <div className="text-center">
            <div className="text-[13px] text-text-dim">La partie commence dans…</div>
          </div>
        )}

        {isSearching && (
          <button
            onClick={cancel}
            className="inline-flex items-center justify-center px-6 h-11 rounded-[41px] bg-transparent border border-text/15 text-text-dim text-[14px] font-medium transition-all duration-200 hover:border-text/30 hover:text-text/72"
          >
            Annuler la recherche
          </button>
        )}
      </div>
    </div>
  )
}
