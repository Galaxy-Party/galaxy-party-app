import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSocket } from '../../hooks/useSocket'
import socket from '../../socket/client'
import type { Room } from '../../types/room/models'
import Starfield from '../../components/Starfield'

const INDIGO = '#818cf8'
const ROSE = '#f472b6'
const AMBER = '#fbbf24'
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

export default function SpectatorPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [room, setRoom] = useState<Room | null>(null)
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null)
  const [question, setQuestion] = useState<{ id: string; label: string } | null>(null)
  const [answerResult, setAnswerResult] = useState<{ correct: boolean; correctAnswer: string } | null>(null)
  const [playerTimes, setPlayerTimes] = useState<Record<string, number>>({})
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const playerLeft = room?.users[0] ?? null
  const playerRight = room?.users[1] ?? null
  const isLeftActive = currentPlayerId === playerLeft?.id
  const leftTime = playerLeft ? (playerTimes[playerLeft.id] ?? 0) : 0
  const rightTime = playerRight ? (playerTimes[playerRight.id] ?? 0) : 0

  useEffect(() => {
    if (!id) return
    socket.emit('room:spectate', { roomId: id }, (err) => {
      if (err) {
        setError(err)
      }
    })
    return () => {
      socket.emit('room:spectate_leave', { roomId: id }, () => {})
    }
  }, [id])

  useEffect(() => {
    if (!currentPlayerId || answerResult !== null || !id) return
    timerRef.current = setInterval(() => {
      setPlayerTimes(prev => {
        const current = prev[currentPlayerId] ?? 0
        if (current <= 0) {
          clearInterval(timerRef.current!)
          return prev
        }
        return { ...prev, [currentPlayerId]: Math.max(0, current - 1000) }
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [currentPlayerId, answerResult, id])

  const handleRoomDetails = useCallback((r: Room) => setRoom(r), [])
  const handleSpectatorState = useCallback(({ question, currentPlayerId, playerTimes }: { question: { id: string; label: string } | null; currentPlayerId: string; playerTimes: Record<string, number> }) => {
    setQuestion(question)
    setCurrentPlayerId(currentPlayerId)
    setPlayerTimes(playerTimes)
    setAnswerResult(null)
  }, [])
  const handleQuestion = useCallback(({ question, currentPlayerId, playerTimes }: { question: { id: string; label: string }; currentPlayerId: string; playerTimes: Record<string, number> }) => {
    setQuestion(question)
    setCurrentPlayerId(currentPlayerId)
    setPlayerTimes(playerTimes)
    setAnswerResult(null)
  }, [])
  const handleAnswerResult = useCallback(({ correct, correctAnswer, playerTimes }: { correct: boolean; correctAnswer: string; answeredBy: string; playerTimes: Record<string, number> }) => {
    setAnswerResult({ correct, correctAnswer })
    setPlayerTimes(playerTimes)
  }, [])
  const handleGameOver = useCallback(({ winnerId }: { winnerId: string }) => {
    setWinnerId(winnerId)
  }, [])
  const handlePlayerQuit = useCallback(() => {
    navigate('/rooms')
  }, [navigate])

  useSocket('room:details', handleRoomDetails)
  useSocket('game:spectator_state', handleSpectatorState)
  useSocket('game:question', handleQuestion)
  useSocket('game:answer_result', handleAnswerResult)
  useSocket('game:over', handleGameOver)
  useSocket('game:player_quit', handlePlayerQuit)

  const activeRing: React.CSSProperties = {
    boxShadow: `0 0 0 3px ${INDIGO}, 0 0 24px rgba(129,140,248,0.5)`,
    borderRadius: '50%',
  }
  const inactiveRing: React.CSSProperties = {
    boxShadow: '0 0 0 2px rgba(78,128,152,0.4)',
    borderRadius: '50%',
    opacity: 0.5,
  }

  if (error) {
    return (
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#07050f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <Starfield />
        <Nebulae />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, color: ROSE, marginBottom: 20 }}>{error}</p>
          <button
            onClick={() => navigate('/rooms')}
            style={{ padding: '0 32px', height: 48, borderRadius: 41, background: 'rgba(79,70,229,0.15)', border: `1px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Retour aux salons
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#07050f', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '20px 32px' }}>
      <Starfield />
      <Nebulae />

      {/* Loading overlay */}
      {currentPlayerId === null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(7,5,15,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: TEXT_DIM, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Connexion…
          </span>
        </div>
      )}

      {/* Game over overlay */}
      {winnerId !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(7,5,15,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-in" style={{ background: 'rgba(12,8,28,0.96)', border: `1px solid ${BORDER}`, borderRadius: 28, padding: '48px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, boxShadow: '0 32px 80px rgba(0,0,0,0.7)', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 52, color: INDIGO, textShadow: 'rgba(129,140,248,0.4)' }}>
              Partie terminée
            </div>
            <div style={{ fontSize: 16, color: 'rgba(241,240,255,0.72)', fontFamily: "'DM Sans', sans-serif" }}>
              {room?.users.find(u => u.id === winnerId)?.username ?? 'Un joueur'} a gagné.
            </div>
            <button
              onClick={() => navigate('/rooms')}
              style={{ marginTop: 12, padding: '0 40px', height: 52, borderRadius: 41, background: 'rgba(79,70,229,0.15)', border: `1px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Retour aux salons
            </button>
          </div>
        </div>
      )}

      {/* Spectator badge + back button */}
      <div style={{ position: 'fixed', top: 24, left: 32, zIndex: 10 }}>
        <button
          onClick={() => navigate('/rooms')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 20px', height: 44, borderRadius: 41, background: 'rgba(129,140,248,0.08)', border: `1px solid rgba(129,140,248,0.4)`, color: INDIGO, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Quitter
        </button>
      </div>

      <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 10 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 16px', height: 36, borderRadius: 41, background: 'rgba(251,191,36,0.08)', border: `1px solid rgba(251,191,36,0.35)`, color: AMBER, fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: AMBER, boxShadow: `0 0 6px ${AMBER}` }} />
          Spectateur
        </span>
      </div>

      {/* Players + timer row */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 48, width: '100%', maxWidth: 760, justifyContent: 'center' }}>

        {/* Left player */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={isLeftActive ? activeRing : inactiveRing}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', background: NAVY, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {playerLeft?.imageName ? (
                <img src={playerLeft.imageName} alt="avatar" style={{ width: '72%', height: '72%', objectFit: 'contain' }} />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" style={{ width: 80, height: 80 }}>
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              )}
            </div>
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: isLeftActive ? INDIGO : TEXT_DIM, transition: 'color 0.3s' }}>
            {playerLeft?.username ?? 'Joueur 1'}
          </div>
          {!isLeftActive && (
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: TEXT_DIM }}>
              {formatTime(leftTime)}
            </div>
          )}
        </div>

        {/* Center timer */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 88, lineHeight: 1, letterSpacing: '-0.02em', color: isLeftActive ? INDIGO : 'rgba(244,114,182,0.8)', transition: 'color 0.3s' }}>
            {formatTime(isLeftActive ? leftTime : rightTime)}
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEXT_DIM, marginTop: 4 }}>
            {currentPlayerId
              ? `Tour de ${room?.users.find(u => u.id === currentPlayerId)?.username ?? '…'}`
              : '…'}
          </div>
        </div>

        {/* Right player */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={!isLeftActive && currentPlayerId !== null ? activeRing : inactiveRing}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', background: NAVY, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {playerRight?.imageName ? (
                <img src={playerRight.imageName} alt="avatar" style={{ width: '72%', height: '72%', objectFit: 'contain' }} />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" style={{ width: 80, height: 80 }}>
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              )}
            </div>
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: !isLeftActive && currentPlayerId !== null ? ROSE : TEXT_DIM, transition: 'color 0.3s' }}>
            {playerRight?.username ?? 'Joueur 2'}
          </div>
          {isLeftActive && (
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: TEXT_DIM }}>
              {formatTime(rightTime)}
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

      {/* Answer result (read-only) */}
      {answerResult && (
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600, color: answerResult.correct ? '#34d399' : ROSE }}>
          {answerResult.correct
            ? `Bonne réponse : ${answerResult.correctAnswer}`
            : `Mauvaise réponse — La bonne réponse était : ${answerResult.correctAnswer}`}
        </div>
      )}
    </div>
  )
}