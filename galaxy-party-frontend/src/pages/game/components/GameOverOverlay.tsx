import type { Room } from '../../../types/room/models'
import type { User } from '../../../types/user/models'
import type { LevelDefinition } from '../../../context/LevelsContext'

interface Props {
  winnerId: string
  user: User | null
  room: Room | null
  isRanked: boolean
  eloChange: { old: number; new: number } | null
  xpUpdate: { newXp: number; newLevel: number; leveledUp: boolean } | null
  levels: LevelDefinition[]
  onReturn: () => void
}

/** End-of-game overlay: result, ELO delta (ranked), XP/level progress and casual stats. */
export default function GameOverOverlay({ winnerId, user, room, isRanked, eloChange, xpUpdate, levels, onReturn }: Props) {
  const isWin = winnerId === user?.id
  const xpGained = isWin ? 30 : 10

  const newXp = xpUpdate?.newXp ?? (user?.xp ?? 0)
  const newLevel = xpUpdate?.newLevel ?? (user?.level ?? 1)
  const curLvlDef = levels.find(l => l.levelNumber === newLevel)
  const nextLvlDef = levels.find(l => l.levelNumber === newLevel + 1)
  const lvlProgress = curLvlDef && nextLvlDef
    ? Math.min(100, Math.round(((newXp - curLvlDef.xpRequired) / (nextLvlDef.xpRequired - curLvlDef.xpRequired)) * 100))
    : 100

  const newGames = (user?.gamesPlayed ?? 0) + 1
  const newWins = (user?.wins ?? 0) + (isWin ? 1 : 0)
  const newLosses = newGames - newWins
  const newRate = Math.round((newWins / newGames) * 100)
  const eloUp = !!eloChange && eloChange.new >= eloChange.old

  return (
    <div className="fixed inset-0 z-30 bg-bg/92 flex items-center justify-center">
      <div className="card-in bg-panel/96 border border-border rounded-[28px] px-14 py-10 flex flex-col items-center shadow-[0_32px_80px_rgba(0,0,0,0.7)] text-center min-w-[380px]">

        <div className={`font-display font-bold text-[52px] mb-2 ${isWin ? 'text-indigo [text-shadow:0_0_32px_rgba(129,140,248,0.4)]' : 'text-rose [text-shadow:0_0_32px_rgba(244,114,182,0.4)]'}`}>
          {isWin ? 'Victoire !' : 'Défaite…'}
        </div>
        <div className="text-[15px] text-text/60 mb-6">
          {isWin
            ? `Bravo ${user?.username ?? ''}, tu as gagné !`
            : `${room?.users.find(u => u.id === winnerId)?.username ?? "L'adversaire"} a gagné.`}
        </div>

        {isRanked && eloChange && (
          <div className={`flex items-center gap-2.5 mb-4 px-5 py-2.5 rounded-[14px] ${eloUp ? 'bg-emerald/8 border border-emerald/30' : 'bg-rose/8 border border-rose/30'}`}>
            <span className="font-display text-[13px] text-text-dim">ELO</span>
            <span className={`font-display font-extrabold text-[18px] ${eloUp ? 'text-emerald' : 'text-rose'}`}>
              {eloUp ? '+' : ''}{eloChange.new - eloChange.old}
            </span>
            <span className="font-display text-[13px] text-text-dim">→</span>
            <span className="font-display font-bold text-[16px] text-amber">{eloChange.new}</span>
          </div>
        )}

        <div className="w-full mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-display text-[12px] text-text-dim tracking-[0.12em] uppercase">Expérience</span>
            <span className="font-display font-bold text-[13px] text-indigo">
              +{xpGained} XP
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-[11px] text-text-dim shrink-0">Niv. {newLevel}</span>
            <div className="flex-1 h-1.5 rounded-[3px] bg-indigo/15 overflow-hidden">
              <div className="h-full rounded-[3px] bg-gradient-to-r from-indigo to-rose transition-[width] duration-[800ms] ease" style={{ width: `${lvlProgress}%` }} />
            </div>
            <span className="text-[10px] text-text-dim shrink-0">
              {nextLvlDef ? `${newXp}/${nextLvlDef.xpRequired}` : 'MAX'}
            </span>
          </div>
          {xpUpdate?.leveledUp && (
            <div className="mt-2 font-display text-[13px] font-bold text-amber">
              ⭐ Niveau {newLevel} atteint !
            </div>
          )}
        </div>

        {!isRanked && (
          <div className="w-full mb-5">
            <div className="font-display text-[10px] font-bold tracking-[0.18em] uppercase text-rose mb-2.5 flex items-center gap-2">
              Statistiques <span className="flex-1 h-px bg-rose/20" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: newWins,       label: 'Victoires', color: 'var(--color-indigo)' },
                { val: newLosses,     label: 'Défaites',  color: 'var(--color-rose)'   },
                { val: `${newRate}%`, label: 'Win rate',  color: 'var(--color-amber)'  },
              ].map(({ val, label, color }) => (
                <div key={label} className="bg-panel/50 border border-border rounded-[12px] px-2 py-2.5 text-center">
                  <div className="font-display font-bold text-[18px]" style={{ color }}>{val}</div>
                  <div className="text-[10px] text-text-dim mt-[3px] tracking-[0.08em] uppercase">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onReturn}
          className={`mt-1 px-10 h-[50px] rounded-[41px] border font-display text-[15px] font-semibold text-text transition-all duration-200 ${isWin ? 'bg-indigo-deep/12 border-indigo' : 'bg-rose/12 border-rose'}`}
        >
          {isRanked ? 'Retour au classé' : 'Retour au salon'}
        </button>
      </div>
    </div>
  )
}
