import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useUserContext } from '../../hooks/useUserContext'
import { useSocket } from '../../hooks/useSocket'
import socket from '../../socket/client'
import type { Room } from '../../types/room/models'
import Starfield from '../../components/Starfield'
import { useToast } from '../../hooks/useToast'

const INDIGO = '#818cf8'
const ROSE = '#f472b6'
const BORDER = 'rgba(129,140,248,0.22)'
const NAVY = '#051240'
const TEXT_DIM = 'rgba(241,240,255,0.35)'

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
      setTimeout(() => navigate('/ranked'), 4000)
    }
  }, [navigate])
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

      {/* Game over overlay */}
      {winnerId !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(7,5,15,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-in" style={{ background: 'rgba(12,8,28,0.96)', border: `1px solid ${BORDER}`, borderRadius: 28, padding: '48px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, boxShadow: '0 32px 80px rgba(0,0,0,0.7)', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 52, color: winnerId === user?.id ? INDIGO : ROSE, textShadow: `0 0 32px ${winnerId === user?.id ? 'rgba(129,140,248,0.4)' : 'rgba(244,114,182,0.4)'}` }}>
              {winnerId === user?.id ? 'Victoire !' : 'Défaite…'}
            </div>
            <div style={{ fontSize: 16, color: 'rgba(241,240,255,0.72)', fontFamily: "'DM Sans', sans-serif" }}>
              {winnerId === user?.id
                ? `Bravo ${user?.username ?? ''}, tu as gagné !`
                : `${room?.users.find(u => u.id === winnerId)?.username ?? "L'adversaire"} a gagné.`}
            </div>
            {isRanked && eloChange && (
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: eloChange.new >= eloChange.old ? '#34d399' : '#f472b6' }}>
                {eloChange.new >= eloChange.old ? '+' : ''}{eloChange.new - eloChange.old} ELO → {eloChange.new}
              </div>
            )}
            <button
              onClick={() => navigate(isRanked ? '/ranked' : `/rooms/${id}`)}
              style={{ marginTop: 12, padding: '0 40px', height: 52, borderRadius: 41, background: 'rgba(79,70,229,0.15)', border: `1px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {isRanked ? 'Retour au classé' : 'Retour au salon'}
            </button>
          </div>
        </div>
      )}

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
