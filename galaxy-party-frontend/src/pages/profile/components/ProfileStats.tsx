import StatCard from './StatCard'
import { AMBER, EMERALD, INDIGO, ROSE } from './profileStyles'

interface Props {
  wins: number
  losses: number
  winRate: number
  elo: number
  xp: number
  level: number
}

/** The player's statistics: two rows of stat tiles under a section title. */
export default function ProfileStats({ wins, losses, winRate, elo, xp, level }: Props) {
  return (
    <>
      <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-rose mb-[14px] flex items-center gap-[10px]">
        Statistiques
        <span className="flex-1 h-px bg-rose/20" />
      </div>
      <div className="grid grid-cols-3 gap-[10px] mb-[10px]">
        <StatCard val={wins} label="Victoires" color={INDIGO} />
        <StatCard val={losses} label="Défaites" color={ROSE} />
        <StatCard val={`${winRate}%`} label="Win rate" color={AMBER} />
      </div>
      <div className="grid grid-cols-3 gap-[10px]">
        <StatCard val={elo} label="ELO" color={AMBER} />
        <StatCard val={xp} label="XP Total" color={EMERALD} />
        <StatCard val={level} label="Niveau" color={INDIGO} />
      </div>
    </>
  )
}
