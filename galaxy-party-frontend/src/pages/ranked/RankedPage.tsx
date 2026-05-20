import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../hooks/useUserContext'
import { useRanks } from '../../hooks/useRanks'
import { getRankInfo, getProgressToNext } from '../../utils/rank'
import CardHeader from '../../components/CardHeader'
import RanksModal from './components/RanksModal'
import RankBanner from './components/RankBanner'
import LeaderboardRow from './components/LeaderboardRow'
import { useLeaderboard } from './hooks/useLeaderboard'

export default function RankedPage() {
  const { user } = useUserContext()
  const navigate = useNavigate()
  const ranks = useRanks()
  const leaderboard = useLeaderboard()
  const [showRanks, setShowRanks] = useState(false)
  const [joining, setJoining] = useState(false)

  const elo = user?.elo ?? 0
  const rank = getRankInfo(elo, ranks)
  const progress = rank ? getProgressToNext(elo, rank) : 0
  const nextElo = rank?.maxElo !== null && rank?.maxElo !== undefined ? rank.maxElo + 1 : null
  const myPos = user ? leaderboard.findIndex(u => u.id === user.id) + 1 : 0

  const posColor = (i: number) => {
    if (i === 0) return 'var(--color-amber)'
    if (i === 1) return 'var(--color-silver)'
    if (i === 2) return 'var(--color-bronze)'
    return 'var(--color-text-dim)'
  }
  const posLabel = (i: number) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`

  return (
    <>
      {showRanks && (
        <RanksModal ranks={ranks} currentRankName={rank?.name} onClose={() => setShowRanks(false)} />
      )}

    <div className="card-in fade-in w-full max-w-[860px] bg-panel/82 backdrop-blur-[28px] border border-border rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

      <CardHeader
        accent="amber"
        title="Classé"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        }
        right={
          <button
            onClick={() => setShowRanks(true)}
            title="Voir les rangs"
            className="w-7 h-7 rounded-full border border-indigo/30 bg-indigo/8 text-text/50 flex items-center justify-center font-display font-bold text-[13px] shrink-0 transition-all duration-200 hover:bg-indigo/18 hover:border-indigo hover:text-indigo"
          >?</button>
        }
      />

      <div className="scrollbar-indigo px-8 pt-7 pb-8 max-h-[calc(100vh-280px)] overflow-y-auto">

        <RankBanner rank={rank} elo={elo} progress={progress} nextElo={nextElo} />

        <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-text-dim mb-2.5">
          Top classement
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          {leaderboard.slice(0, 5).map((u, i) => (
            <LeaderboardRow
              key={u.id}
              label={posLabel(i)}
              labelColor={posColor(i)}
              imageName={u.imageName}
              name={u.id === user?.id ? 'Vous' : u.username}
              elo={u.elo}
              highlighted={u.id === user?.id}
            />
          ))}

          {myPos > 5 && user && (
            <>
              <div className="text-center text-text-dim text-[12px] py-0.5">···</div>
              <LeaderboardRow
                label={`#${myPos}`}
                labelColor="var(--color-text-dim)"
                imageName={user.imageName}
                name="Vous"
                elo={elo}
                highlighted
              />
            </>
          )}
        </div>

        <div className="flex gap-2.5 mt-1">
          <button
            disabled={joining}
            onClick={() => { setJoining(true); navigate('/ranked/matchmaking') }}
            className={`inline-flex items-center gap-2 px-8 h-13 rounded-[41px] border border-amber text-amber font-display text-[15px] font-semibold tracking-[0.02em] transition-all duration-200 shadow-[0_0_16px_rgba(251,191,36,0.15)] ${joining ? 'bg-amber/5 opacity-50 cursor-not-allowed' : 'bg-amber/10 hover:bg-amber/18'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            {joining ? 'Connexion…' : 'Jouer en Classé'}
          </button>
        </div>

      </div>
    </div>
    </>
  )
}
