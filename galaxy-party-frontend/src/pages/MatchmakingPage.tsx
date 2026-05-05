import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../hooks/useUserContext'
import { useSocket } from '../hooks/useSocket'
import { useRanks } from '../hooks/useRanks'
import socket from '../socket/client'
import Starfield from '../components/Starfield'
import { getRankInfo } from '../utils/rank'

interface Opponent {
  userId: string
  username: string
  imageName: string | null
  elo: number
}

type Phase = 'searching' | 'found' | 'countdown'

const NAVY    = '#051240'
const INDIGO  = '#818cf8'
const EMERALD = '#34d399'
const AMBER   = '#fbbf24'
const TEXT    = '#f1f0ff'
const TEXT_DIM = 'rgba(241,240,255,0.35)'
const PANEL   = 'rgba(12,8,28,0.82)'
const BORDER  = 'rgba(129,140,248,0.22)'

function Nebulae() {
  return (
    <>
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 700, height: 500, background: '#4f46e5', opacity: 0.14, top: -180, left: -120, animation: 'nf 18s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 600, height: 450, background: '#db2777', opacity: 0.10, bottom: -120, right: -80, animation: 'nf 18s ease-in-out infinite alternate', animationDelay: '-7s' }} />
    </>
  )
}

interface AvatarSlotProps {
  imageName?: string | null
  name: string
  rankName: string
  rankColor: string
  elo: number
  searching?: boolean
  phase: Phase
}

function AvatarSlot({ imageName, name, rankName, elo, searching, phase }: AvatarSlotProps) {
  const borderColor = searching
    ? 'rgba(129,140,248,0.3)'
    : (phase === 'found' || phase === 'countdown') ? EMERALD : INDIGO
  const shadow = searching
    ? 'none'
    : (phase === 'found' || phase === 'countdown')
      ? '0 0 28px rgba(52,211,153,0.3)'
      : '0 0 28px rgba(129,140,248,0.3)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 160 }}>
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        {searching && (
          <>
            <div style={{ position: 'absolute', top: -12, right: -12, bottom: -12, left: -12, borderRadius: '50%', border: '2px solid rgba(129,140,248,0.2)', animation: 'mmPulse 1.6s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: -24, right: -24, bottom: -24, left: -24, borderRadius: '50%', border: '1px solid rgba(129,140,248,0.1)', animation: 'mmPulse 1.6s ease-in-out infinite', animationDelay: '0.4s' }} />
          </>
        )}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: NAVY,
          border: `3px solid ${borderColor}`,
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: shadow,
          transition: 'border-color 0.5s, box-shadow 0.5s',
          position: 'relative',
        }}>
          {imageName
            ? <img src={imageName} alt="" style={{ width: '72%', height: '72%', objectFit: 'contain' }} />
            : <svg viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth="1.5" width="44" height="44"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          }
        </div>
      </div>

      {searching ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: TEXT_DIM }}>Recherche…</div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 8 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(129,140,248,0.5)', animation: 'mmDot 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{name}</div>
          <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 2 }}>{rankName}</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: AMBER, marginTop: 4 }}>{elo} ELO</div>
        </div>
      )}
    </div>
  )
}

export default function MatchmakingPage() {
  const { user } = useUserContext()
  const navigate = useNavigate()
  const [elapsed, setElapsed] = useState(0)
  const [phase, setPhase] = useState<Phase>('searching')
  const [countdown, setCountdown] = useState(3)
  const [opponent, setOpponent] = useState<Opponent | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const cancelledRef = useRef(false)

  const ranks = useRanks()
  const myElo = user?.elo ?? 0
  const myRank = getRankInfo(myElo, ranks)
  const oppRank = opponent ? getRankInfo(opponent.elo, ranks) : null

  useEffect(() => {
    socket.emit('ranked:join_queue', (err) => {
      if (err) navigate('/ranked')
    })
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => {
      clearInterval(t)
      if (cancelledRef.current) return
      socket.emit('ranked:leave_queue', () => {})
    }
  }, [navigate])

  useSocket('ranked:match_found', ({ roomId: rid, opponent: opp }) => {
    if (cancelledRef.current) return
    setOpponent(opp)
    setRoomId(rid)
    setPhase('found')
    setTimeout(() => setPhase('countdown'), 800)
  })

  useEffect(() => {
    if (phase !== 'countdown' || !roomId) return
    let count = 3
    const cd = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(cd)
        cancelledRef.current = true
        setTimeout(() => navigate(`/rooms/${roomId}/game`), 300)
      }
    }, 1000)
    return () => clearInterval(cd)
  }, [phase, roomId, navigate])

  const handleCancel = () => {
    cancelledRef.current = true
    socket.emit('ranked:leave_queue', () => {})
    navigate('/ranked')
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes mmPulse { 0%,100%{opacity:0.6;transform:scale(1);} 50%{opacity:0.1;transform:scale(1.12);} }
        @keyframes mmDot   { 0%,100%{transform:translateY(0);opacity:0.4;} 50%{transform:translateY(-5px);opacity:1;} }
        @keyframes mmVs    { from{opacity:0;transform:scale(0.6);} to{opacity:1;transform:scale(1);} }
        @keyframes cardIn  { from{opacity:0;transform:translateY(16px) scale(0.98);} to{opacity:1;transform:none;} }
      `}</style>
      <Starfield />
      <Nebulae />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: PANEL, backdropFilter: 'blur(28px)',
        border: `1px solid ${BORDER}`, borderRadius: 28,
        padding: '48px 52px 44px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36,
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        minWidth: 460,
        animation: 'cardIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: AMBER, marginBottom: 6 }}>
            ⭐ Mode Classé
          </div>
          {phase === 'searching' && (
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: TEXT }}>
              Recherche d'un adversaire…
            </div>
          )}
          {(phase === 'found' || phase === 'countdown') && (
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: EMERALD, animation: 'cardIn 0.3s ease forwards' }}>
              Adversaire trouvé !
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <AvatarSlot
            imageName={user?.imageName}
            name={user?.username ?? ''}
            rankName={myRank?.name ?? ''}
            rankColor={myRank?.color ?? ''}
            elo={myElo}
            phase={phase}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {phase === 'countdown' ? (
              <div
                key={countdown}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 52, color: INDIGO, lineHeight: 1, animation: 'mmVs 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards', textShadow: '0 0 32px rgba(129,140,248,0.5)' }}
              >
                {countdown}
              </div>
            ) : (
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 28, color: 'rgba(129,140,248,0.4)', letterSpacing: '0.05em' }}>
                VS
              </div>
            )}
          </div>

          {phase === 'searching' ? (
            <AvatarSlot name="" rankName="" rankColor="" elo={0} searching phase={phase} />
          ) : (
            <AvatarSlot
              imageName={opponent?.imageName}
              name={opponent?.username ?? ''}
              rankName={oppRank?.name ?? ''}
              rankColor={oppRank?.color ?? ''}
              elo={opponent?.elo ?? 0}
              phase={phase}
            />
          )}
        </div>

        {phase === 'searching' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, color: INDIGO, letterSpacing: '0.1em' }}>
              {fmt(elapsed)}
            </div>
            <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
              Temps de recherche
            </div>
          </div>
        )}
        {(phase === 'found' || phase === 'countdown') && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: TEXT_DIM }}>La partie commence dans…</div>
          </div>
        )}

        {phase === 'searching' && (
          <button
            onClick={handleCancel}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', height: 44, borderRadius: 41, background: 'transparent', border: '1px solid rgba(241,240,255,0.15)', color: TEXT_DIM, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(241,240,255,0.3)'; el.style.color = 'rgba(241,240,255,0.72)' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(241,240,255,0.15)'; el.style.color = TEXT_DIM }}
          >
            Annuler la recherche
          </button>
        )}
      </div>
    </div>
  )
}
