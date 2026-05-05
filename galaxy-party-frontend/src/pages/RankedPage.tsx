import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../hooks/useUserContext'
import { useSocket } from '../hooks/useSocket'
import { useRanks } from '../hooks/useRanks'
import socket from '../socket/client'
import { getRankInfo, getProgressToNext } from '../utils/rank'

const AMBER = '#fbbf24'
const BORDER = 'rgba(129,140,248,0.22)'
const PANEL = 'rgba(12,8,28,0.82)'
const TEXT_DIM = 'rgba(241,240,255,0.35)'
const TEXT = '#f1f0ff'
const NAVY = '#051240'
const INDIGO = '#818cf8'

export default function RankedPage() {
  const { user, updateElo } = useUserContext()
  const navigate = useNavigate()
  const ranks = useRanks()
  const [leaderboard, setLeaderboard] = useState<{ id: string; username: string; imageName: string | null; elo: number }[]>([])
  const [showRanks, setShowRanks] = useState(false)

  useEffect(() => {
    socket.emit('ranked:get_leaderboard', () => {})
  }, [])

  useSocket('ranked:leaderboard', ({ entries, myElo }) => {
    setLeaderboard(entries)
    updateElo(myElo)
  })

  useSocket('ranked:elo_updated', () => {
    socket.emit('ranked:get_leaderboard', () => {})
  })

  const elo = user?.elo ?? 0
  const rank = getRankInfo(elo, ranks)
  const progress = rank ? getProgressToNext(elo, rank) : 0
  const nextElo = rank?.maxElo !== null && rank?.maxElo !== undefined ? rank.maxElo + 1 : null
  const myPos = user ? leaderboard.findIndex(u => u.id === user.id) + 1 : 0

  const posColor = (i: number) => {
    if (i === 0) return AMBER
    if (i === 1) return '#94a3b8'
    if (i === 2) return '#cd7f32'
    return TEXT_DIM
  }
  const posLabel = (i: number) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`

  return (
    <>
      {showRanks && (
        <div
          onClick={() => setShowRanks(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="card-in"
            style={{ background: 'rgba(12,8,28,0.96)', border: `1px solid ${BORDER}`, borderRadius: 24, padding: '32px 36px', minWidth: 360, maxWidth: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.7)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: TEXT }}>Rangs</span>
              <button
                onClick={() => setShowRanks(false)}
                style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${BORDER}`, background: 'transparent', color: TEXT_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#f472b6'; el.style.borderColor = 'rgba(244,114,182,0.4)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = TEXT_DIM; el.style.borderColor = BORDER }}
              >✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ranks.map(r => {
                const isCurrentRank = rank?.name === r.name
                return (
                  <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, border: `1px solid ${isCurrentRank ? r.color : 'rgba(129,140,248,0.12)'}`, background: isCurrentRank ? `${r.color}18` : 'rgba(12,8,28,0.4)' }}>
                    <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{r.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: r.color }}>{r.name}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: TEXT_DIM, marginTop: 1 }}>
                        {r.maxElo === null ? `${r.minElo}+ ELO` : `${r.minElo} – ${r.maxElo} ELO`}
                      </div>
                    </div>
                    {isCurrentRank && (
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${r.color}20`, border: `1px solid ${r.color}60`, color: r.color, letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }}>
                        Votre rang
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

    <div className="card-in fade-in" style={{ width: '100%', maxWidth: 860, background: PANEL, backdropFilter: 'blur(28px)', border: `1px solid ${BORDER}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>

      <div style={{ padding: '20px 32px 16px', borderBottom: '1px solid rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '0.02em', color: TEXT, flex: 1 }}>
          Classé
        </span>
        <button
          onClick={() => setShowRanks(true)}
          title="Voir les rangs"
          style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(129,140,248,0.3)', background: 'rgba(129,140,248,0.08)', color: 'rgba(241,240,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0, transition: 'all 0.2s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(129,140,248,0.18)'; el.style.borderColor = INDIGO; el.style.color = INDIGO }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(129,140,248,0.08)'; el.style.borderColor = 'rgba(129,140,248,0.3)'; el.style.color = 'rgba(241,240,255,0.5)' }}
        >?</button>
      </div>

      <div className="scrollbar-indigo" style={{ padding: '28px 32px 32px', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>

        <div style={{ borderRadius: 16, padding: '20px 22px', border: '1px solid rgba(251,191,36,0.3)', background: 'linear-gradient(135deg,rgba(251,191,36,0.08),rgba(251,191,36,0.02))', display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,rgba(251,191,36,0.2),rgba(251,191,36,0.05))', border: '2px solid rgba(251,191,36,0.4)', flexShrink: 0 }}>
            <div style={{ fontSize: 20 }}>{rank?.icon ?? '🥉'}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, color: AMBER, letterSpacing: '0.1em' }}>{(rank?.name ?? '').substring(0, 4).toUpperCase()}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: AMBER }}>
              Rang actuel : {rank?.name ?? '—'}
            </div>
            <div style={{ fontSize: 13, color: TEXT_DIM, marginTop: 2 }}>
              {rank?.next && nextElo !== null
                ? `+${nextElo - elo} pts pour progresser vers ${rank.next}`
                : rank ? 'Rang maximum atteint' : '—'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(251,191,36,0.15)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', width: `${progress}%`, transition: 'width 0.7s ease' }} />
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: TEXT_DIM, whiteSpace: 'nowrap' }}>{progress}%</span>
            </div>
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 28, color: AMBER, marginLeft: 'auto', flexShrink: 0, textShadow: '0 0 16px rgba(251,191,36,0.4)' }}>
            {elo}
          </div>
        </div>

        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: TEXT_DIM, marginBottom: 10 }}>
          Top classement
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
          {leaderboard.slice(0, 5).map((u, i) => {
            const isMe = u.id === user?.id
            return (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, border: isMe ? '1px solid rgba(129,140,248,0.4)' : `1px solid ${BORDER}`, background: isMe ? 'rgba(129,140,248,0.06)' : 'rgba(12,8,28,0.4)', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, width: 24, textAlign: 'center', color: posColor(i) }}>
                  {posLabel(i)}
                </div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: NAVY, border: '1px solid rgba(129,140,248,0.25)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {u.imageName
                    ? <img src={u.imageName} alt="" style={{ width: '75%', height: '75%', objectFit: 'contain' }} />
                    : <svg viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth="1.5" width="16" height="16"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  }
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                  {isMe ? 'Vous' : u.username}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: AMBER, flexShrink: 0 }}>
                  {u.elo}
                </div>
              </div>
            )
          })}

          {myPos > 5 && user && (
            <>
              <div style={{ textAlign: 'center', color: TEXT_DIM, fontSize: 12, padding: '2px 0' }}>···</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(129,140,248,0.4)', background: 'rgba(129,140,248,0.06)', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, width: 24, textAlign: 'center', color: TEXT_DIM }}>
                  #{myPos}
                </div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: NAVY, border: '1px solid rgba(129,140,248,0.25)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {user.imageName && <img src={user.imageName} alt="" style={{ width: '75%', height: '75%', objectFit: 'contain' }} />}
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: TEXT }}>Vous</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: AMBER }}>{elo}</div>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={() => navigate('/ranked/matchmaking')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 32px', height: 52, borderRadius: 41, background: 'rgba(251,191,36,0.1)', border: `1px solid ${AMBER}`, color: AMBER, fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: '0.02em', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 16px rgba(251,191,36,0.15)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.18)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.1)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Jouer en Classé
          </button>
        </div>

      </div>
    </div>
    </>
  )
}
