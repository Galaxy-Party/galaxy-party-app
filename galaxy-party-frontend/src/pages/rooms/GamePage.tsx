import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useUserContext } from '../../hooks/useUserContext'
import { useSocket } from '../../hooks/useSocket'
import { useLevels } from '../../hooks/useLevels'
import socket from '../../socket/client'
import type { Room } from '../../types/room/models'
import Starfield from '../../components/Starfield'
import { useToast } from '../../hooks/useToast'

const INDIGO   = '#818cf8'
const ROSE     = '#f472b6'
const EMERALD  = '#34d399'
const AMBER    = '#fbbf24'
const BORDER   = 'rgba(129,140,248,0.22)'
const NAVY     = '#051240'
const TEXT_DIM = 'rgba(241,240,255,0.35)'
const TEXT     = '#f1f0ff'

function formatTime(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function Nebulae() {
  return (
    <>
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 700, height: 500, background: '#4f46e5', opacity: 0.14, top: -180, left: -120, animation: 'nf 18s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 600, height: 450, background: '#db2777', opacity: 0.10, bottom: -120, right: -80, animation: 'nf 18s ease-in-out infinite alternate', animationDelay: '-7s' }} />
    </>
  )
}

export default function GamePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { user, updateElo } = useUserContext()
  const levels = useLevels()
  const toast = useToast()

  const rankedFromState = location.state?.isRanked === true

  const [room, setRoom] = useState<Room | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null)
  const [question, setQuestion] = useState<{ id: string; label: string } | null>(null)
  const [answer, setAnswer] = useState('')
  const [answerResult, setAnswerResult] = useState<{ correct: boolean; correctAnswer: string } | null>(null)
  const [playerTimes, setPlayerTimes] = useState<Record<string, number>>({})
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const [isRanked, setIsRanked] = useState(rankedFromState)
  const [eloChange, setEloChange] = useState<{ old: number; new: number } | null>(null)
  const [xpUpdate, setXpUpdate] = useState<{ newXp: number; newLevel: number; leveledUp: boolean } | null>(null)
  const isRankedRef = useRef(rankedFromState)

  const [turnBanner, setTurnBanner] = useState<{ text: string; isMine: boolean; key: number } | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const turnBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const opponent = room?.users.find(u => u.id !== user?.id) ?? null
  const opponentName = opponent?.username ?? 'l\'adversaire'
  const isMyTurn = currentPlayerId === user?.id
  const myTime = user ? (playerTimes[user.id] ?? 0) : 0
  const opponentTime = opponent ? (playerTimes[opponent.id] ?? 0) : 0


  useEffect(() => {
    if (!id || !user) return
    socket.emit('room:get', id, (err) => { if (err) toast.error(err) })
    socket.emit('game:player_ready', { roomId: id }, (err) => { if (err) toast.error(err) })
  }, [id, user, toast])

  useEffect(() => {
    if (!currentPlayerId) return
    const isMine = currentPlayerId === user?.id
    const text = isMine ? 'À vous de jouer !' : `Tour de ${opponentName}`
    if (turnBannerTimerRef.current) clearTimeout(turnBannerTimerRef.current)
      // eslint-disable-next-line react-hooks/set-state-in-effect
    setTurnBanner({ text, isMine, key: Date.now() })
    turnBannerTimerRef.current = setTimeout(() => setTurnBanner(null), 2000)
    return () => { if (turnBannerTimerRef.current) clearTimeout(turnBannerTimerRef.current) }
  }, [currentPlayerId, user?.id, opponentName])

  useEffect(() => {
    if (!currentPlayerId || answerResult !== null || !id || !user) return
    timerRef.current = setInterval(() => {
      setPlayerTimes(prev => {
        const current = prev[currentPlayerId] ?? 0
        if (current <= 1000) {
          clearInterval(timerRef.current!)
          if (currentPlayerId === user.id) {
            socket.emit('game:time_up', { roomId: id }, () => {})
          }
          return { ...prev, [currentPlayerId]: 0 }
        }
        return { ...prev, [currentPlayerId]: current - 1000 }
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [currentPlayerId, answerResult, id, user])

  const handleRoomDetails = useCallback((r: Room) => setRoom(r), [])
  const handleCountdown = useCallback((count: number) => setCountdown(count), [])
  const handleGameStarted = useCallback(({ currentPlayerId }: { currentPlayerId: string }) => {
    setCurrentPlayerId(currentPlayerId)
    setCountdown(null)
  }, [])
  const handleQuestion = useCallback(({ question, currentPlayerId, playerTimes }: { question: { id: string; label: string }; currentPlayerId: string; playerTimes: Record<string, number> }) => {
    setQuestion(question)
    setCurrentPlayerId(currentPlayerId)
    setPlayerTimes(playerTimes)
    setAnswer('')
    setAnswerResult(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])
  const handleAnswerResult = useCallback(({ correct, correctAnswer, playerTimes }: { correct: boolean; correctAnswer: string; answeredBy: string; playerTimes: Record<string, number> }) => {
    setAnswerResult({ correct, correctAnswer })
    setPlayerTimes(playerTimes)
  }, [])
  const handleGameOver = useCallback(({ winnerId }: { winnerId: string }) => {
    setWinnerId(winnerId)
    if (isRankedRef.current) {
      setTimeout(() => navigate('/ranked'), 6000)
    }
  }, [navigate])

  const handleXpUpdated = useCallback(({ xp, level, leveledUp }: { xp: number; level: number; leveledUp: boolean }) => {
    setXpUpdate({ newXp: xp, newLevel: level, leveledUp })
  }, [])
  const handleSessionStarted = useCallback(() => {
    isRankedRef.current = true
    setIsRanked(true)
  }, [])
  const handlePlayerQuit = useCallback(() => {
    navigate(isRankedRef.current ? '/ranked' : `/rooms/${id}`)
  }, [navigate, id])
  const handleEloUpdated = useCallback((newElo: number) => {
    setEloChange(prev => ({ old: prev?.new ?? (user?.elo ?? 0), new: newElo }))
    updateElo(newElo)
  }, [updateElo, user])

  useSocket('ranked:session_started', handleSessionStarted)
  useSocket('room:details', handleRoomDetails)
  useSocket('game:countdown', handleCountdown)
  useSocket('game:started', handleGameStarted)
  useSocket('game:question', handleQuestion)
  useSocket('game:answer_result', handleAnswerResult)
  useSocket('game:over', handleGameOver)
  useSocket('game:player_quit', handlePlayerQuit)
  useSocket('ranked:elo_updated', handleEloUpdated)
  useSocket('profile:xp_updated', handleXpUpdated)

  const submitAnswer = useCallback(() => {
    if (currentPlayerId !== user?.id || !answer.trim() || !id || !user) return
    socket.emit('game:answer', { roomId: id, answer }, (err) => { if (err) toast.error(err) })
  }, [currentPlayerId, user, answer, id, toast])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#07050f', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '20px 32px' }}>
      <Starfield />
      <Nebulae />

      {/* Turn banner */}
      {turnBanner && (
        <div key={turnBanner.key} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 15, pointerEvents: 'none', animation: 'turnBanner 2s ease forwards' }}>
          <div style={{ padding: '14px 32px', borderRadius: 41, background: turnBanner.isMine ? 'rgba(129,140,248,0.12)' : 'rgba(244,114,182,0.10)', border: `1.5px solid ${turnBanner.isMine ? 'rgba(129,140,248,0.6)' : 'rgba(244,114,182,0.6)'}`, boxShadow: `0 0 32px ${turnBanner.isMine ? 'rgba(129,140,248,0.25)' : 'rgba(244,114,182,0.2)'}`, backdropFilter: 'blur(12px)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '0.02em', color: turnBanner.isMine ? INDIGO : ROSE, whiteSpace: 'nowrap' }}>
            {turnBanner.text}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {currentPlayerId === null && countdown === null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(7,5,15,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: TEXT_DIM, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Chargement…
          </span>
        </div>
      )}

      {/* Countdown overlay */}
      {countdown !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(7,5,15,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '10rem', lineHeight: 1, color: INDIGO, textShadow: '0 0 40px rgba(129,140,248,0.5)' }}>
            {countdown}
          </span>
        </div>
      )}

      {winnerId !== null && (() => {
        const isWin = winnerId === user?.id
        const accentColor = isWin ? INDIGO : ROSE
        const xpGained = isWin ? 30 : 10

        const newXp = xpUpdate?.newXp ?? (user?.xp ?? 0)
        const newLevel = xpUpdate?.newLevel ?? (user?.level ?? 1)
        const curLvlDef = levels.find(l => l.levelNumber === newLevel)
        const nextLvlDef = levels.find(l => l.levelNumber === newLevel + 1)
        const lvlProgress = curLvlDef && nextLvlDef
          ? Math.min(100, Math.round(((newXp - curLvlDef.xpRequired) / (nextLvlDef.xpRequired - curLvlDef.xpRequired)) * 100))
          : 100

        const newGames = (user?.gamesPlayed ?? 0) + 1
        const newWins  = (user?.wins ?? 0) + (isWin ? 1 : 0)
        const newLosses = newGames - newWins
        const newRate  = Math.round((newWins / newGames) * 100)

        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(7,5,15,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card-in" style={{ background: 'rgba(12,8,28,0.96)', border: `1px solid ${BORDER}`, borderRadius: 28, padding: '40px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, boxShadow: '0 32px 80px rgba(0,0,0,0.7)', textAlign: 'center', minWidth: 380 }}>

              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 52, color: accentColor, textShadow: `0 0 32px ${isWin ? 'rgba(129,140,248,0.4)' : 'rgba(244,114,182,0.4)'}`, marginBottom: 8 }}>
                {isWin ? 'Victoire !' : 'Défaite…'}
              </div>
              <div style={{ fontSize: 15, color: 'rgba(241,240,255,0.6)', fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>
                {isWin
                  ? `Bravo ${user?.username ?? ''}, tu as gagné !`
                  : `${room?.users.find(u => u.id === winnerId)?.username ?? "L'adversaire"} a gagné.`}
              </div>

              {isRanked && eloChange && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 20px', borderRadius: 14, background: eloChange.new >= eloChange.old ? 'rgba(52,211,153,0.08)' : 'rgba(244,114,182,0.08)', border: `1px solid ${eloChange.new >= eloChange.old ? 'rgba(52,211,153,0.3)' : 'rgba(244,114,182,0.3)'}` }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: TEXT_DIM }}>ELO</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: eloChange.new >= eloChange.old ? EMERALD : ROSE }}>
                    {eloChange.new >= eloChange.old ? '+' : ''}{eloChange.new - eloChange.old}
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: TEXT_DIM }}>→</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: AMBER }}>{eloChange.new}</span>
                </div>
              )}

              <div style={{ width: '100%', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: TEXT_DIM, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Expérience</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: INDIGO }}>
                    +{xpGained} XP
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: TEXT_DIM, flexShrink: 0 }}>Niv. {newLevel}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(129,140,248,0.15)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg,${INDIGO},${ROSE})`, width: `${lvlProgress}%`, transition: 'width 0.8s ease' }} />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: TEXT_DIM, flexShrink: 0 }}>
                    {nextLvlDef ? `${newXp}/${nextLvlDef.xpRequired}` : 'MAX'}
                  </span>
                </div>
                {xpUpdate?.leveledUp && (
                  <div style={{ marginTop: 8, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: AMBER }}>
                    ⭐ Niveau {newLevel} atteint !
                  </div>
                )}
              </div>

              {!isRanked && (
                <div style={{ width: '100%', marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ROSE, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    Statistiques <span style={{ flex: 1, height: 1, background: 'rgba(244,114,182,0.2)' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {[
                      { val: newWins,          label: 'Victoires', color: INDIGO },
                      { val: newLosses,        label: 'Défaites',  color: ROSE   },
                      { val: `${newRate}%`,    label: 'Win rate',  color: AMBER  },
                    ].map(({ val, label, color }) => (
                      <div key={label} style={{ background: 'rgba(12,8,28,0.5)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color }}>{val}</div>
                        <div style={{ fontSize: 10, color: TEXT_DIM, marginTop: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate(isRanked ? '/ranked' : `/rooms/${id}`)}
                style={{ marginTop: 4, padding: '0 40px', height: 50, borderRadius: 41, background: `rgba(${isWin ? '79,70,229' : '244,114,182'},0.12)`, border: `1px solid ${accentColor}`, color: TEXT, fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {isRanked ? 'Retour au classé' : 'Retour au salon'}
              </button>
            </div>
          </div>
        )
      })()}

      {/* Quit button */}
      <div style={{ position: 'fixed', top: 24, left: 32, zIndex: 10 }}>
        <button
          onClick={() => { socket.emit('game:quit', { roomId: id! }, () => { navigate(isRankedRef.current ? '/ranked' : `/rooms/${id}`) }) }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 20px', height: 44, borderRadius: 41, background: 'rgba(244,114,182,0.08)', border: `1px solid rgba(244,114,182,0.4)`, color: ROSE, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Quitter la partie
        </button>
      </div>

      {/* Players + timer row */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 48, width: '100%', maxWidth: 760, justifyContent: 'center' }}>

        {/* My avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isMyTurn && (
              <>
                <div style={{ position: 'absolute', inset: 20, borderRadius: '50%', background: 'conic-gradient(from 0deg, rgba(129,140,248,0) 0deg, rgba(129,140,248,0.85) 60deg, rgba(244,114,182,0.7) 130deg, rgba(129,140,248,0) 220deg, rgba(129,140,248,0.85) 320deg, rgba(129,140,248,0) 360deg)', filter: 'blur(14px)', animation: 'haloRot 6s linear infinite, haloAuraBreath 2.4s ease-in-out infinite', zIndex: 1 }} />
                <div style={{ position: 'absolute', inset: 32, borderRadius: '50%', background: 'conic-gradient(from 90deg, rgba(244,114,182,0) 0deg, rgba(244,114,182,0.55) 90deg, rgba(129,140,248,0.65) 200deg, rgba(244,114,182,0) 360deg)', filter: 'blur(10px)', animation: 'haloRotR 9s linear infinite', zIndex: 1 }} />
              </>
            )}
            <div style={{ position: 'relative', zIndex: 2, width: 140, height: 140, borderRadius: '50%', background: NAVY, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isMyTurn ? `2px solid ${INDIGO}` : '2px solid rgba(78,128,152,0.4)', opacity: isMyTurn ? 1 : 0.55, transition: 'opacity 0.3s, border-color 0.3s' }}>
              {user?.imageName ? (
                <img src={user.imageName} alt="avatar" style={{ width: '72%', height: '72%', objectFit: 'contain' }} />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" style={{ width: 80, height: 80 }}>
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              )}
            </div>
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: isMyTurn ? INDIGO : TEXT_DIM, transition: 'color 0.3s' }}>
            {user?.username ?? 'Joueur 1'}
          </div>
          {!isMyTurn && (
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: TEXT_DIM }}>
              {formatTime(myTime)}
            </div>
          )}
        </div>

        {/* Center timer */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 88, lineHeight: 1, letterSpacing: '-0.02em', color: isMyTurn ? INDIGO : 'rgba(244,114,182,0.8)', transition: 'color 0.3s' }}>
            {formatTime(isMyTurn ? myTime : opponentTime)}
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEXT_DIM, marginTop: 4 }}>
            {isMyTurn ? `Tour de ${user?.username ?? 'Joueur 1'}` : `Tour de ${opponent?.username ?? 'Joueur 2'}`}
          </div>
        </div>

        {/* Opponent avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!isMyTurn && (
              <>
                <div style={{ position: 'absolute', inset: 20, borderRadius: '50%', background: 'conic-gradient(from 0deg, rgba(129,140,248,0) 0deg, rgba(129,140,248,0.85) 60deg, rgba(244,114,182,0.7) 130deg, rgba(129,140,248,0) 220deg, rgba(129,140,248,0.85) 320deg, rgba(129,140,248,0) 360deg)', filter: 'blur(14px)', animation: 'haloRot 6s linear infinite, haloAuraBreath 2.4s ease-in-out infinite', zIndex: 1 }} />
                <div style={{ position: 'absolute', inset: 32, borderRadius: '50%', background: 'conic-gradient(from 90deg, rgba(244,114,182,0) 0deg, rgba(244,114,182,0.55) 90deg, rgba(129,140,248,0.65) 200deg, rgba(244,114,182,0) 360deg)', filter: 'blur(10px)', animation: 'haloRotR 9s linear infinite', zIndex: 1 }} />
              </>
            )}
            <div style={{ position: 'relative', zIndex: 2, width: 140, height: 140, borderRadius: '50%', background: NAVY, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: !isMyTurn ? `2px solid ${INDIGO}` : '2px solid rgba(78,128,152,0.4)', opacity: !isMyTurn ? 1 : 0.55, transition: 'opacity 0.3s, border-color 0.3s' }}>
              {opponent ? (
                <img src={opponent.imageName ?? undefined} alt="avatar" style={{ width: '72%', height: '72%', objectFit: 'contain' }} />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" style={{ width: 80, height: 80 }}>
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              )}
            </div>
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: !isMyTurn ? ROSE : TEXT_DIM, transition: 'color 0.3s' }}>
            {opponent?.username ?? 'Joueur 2'}
          </div>
          {isMyTurn && (
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: TEXT_DIM }}>
              {formatTime(opponentTime)}
            </div>
          )}
        </div>
      </div>

      {/* Question */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 660, background: 'rgba(12,8,28,0.75)', border: `1px solid ${BORDER}`, borderRadius: 20, padding: '24px 32px', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
        <p style={{ fontSize: 18, color: 'rgba(241,240,255,0.72)', lineHeight: 1.6 }}>
          {question?.label ?? '…'}
        </p>
      </div>

      {/* Answer */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {answerResult && (
          <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 600, color: answerResult.correct ? '#34d399' : ROSE }}>
            {answerResult.correct ? `Bonne réponse : ${answerResult.correctAnswer}` : `Mauvaise réponse — La bonne réponse était : ${answerResult.correctAnswer}`}
          </div>
        )}
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submitAnswer()}
          placeholder="Votre réponse…"
          ref={inputRef}
          disabled={!isMyTurn || answerResult !== null}
          style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `2px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 500, textAlign: 'center', outline: 'none', paddingBottom: 10, opacity: (!isMyTurn || answerResult !== null) ? 0.3 : 1 }}
        />
        <button
          disabled={!isMyTurn || answerResult !== null}
          onClick={submitAnswer}
          style={{ padding: '0 48px', height: 52, borderRadius: 41, background: 'rgba(79,70,229,0.15)', border: `1px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: (isMyTurn && !answerResult) ? 'pointer' : 'not-allowed', transition: 'all 0.2s', opacity: (isMyTurn && !answerResult) ? 1 : 0.3 }}
        >
          Valider
        </button>
      </div>
    </div>
  )
}
