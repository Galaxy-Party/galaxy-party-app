import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import socket from '../../../socket/client'
import { useSocket } from '../../../hooks/useSocket'
import type { Room } from '../../../types/room/models'

interface Question { id: string; label: string }
interface AnswerResult { correct: boolean; correctAnswer: string; submittedAnswer: string; answeredBy: string }

/** Read-only spectator session: subscribes to the game, ticks the active clock, exposes the state. */
export function useSpectatorSession() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [room, setRoom] = useState<Room | null>(null)
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null)
  const [playerTimes, setPlayerTimes] = useState<Record<string, number>>({})
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const [playerQuit, setPlayerQuit] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!id) return
    socket.emit('room:spectate', { roomId: id }, (err) => {
      if (err) setError(err)
    })
    return () => {
      socket.emit('room:spectate_leave', { roomId: id }, () => {})
    }
  }, [id])

  useEffect(() => {
    if (!currentPlayerId || answerResult !== null || !id || winnerId !== null) return
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
  }, [currentPlayerId, answerResult, id, winnerId])

  const handleRoomDetails = useCallback((r: Room) => setRoom(r), [])
  const handleSpectatorState = useCallback(({ question, currentPlayerId, playerTimes }: { question: Question | null; currentPlayerId: string; playerTimes: Record<string, number> }) => {
    setQuestion(question)
    setCurrentPlayerId(currentPlayerId)
    setPlayerTimes(playerTimes)
    setAnswerResult(null)
  }, [])
  const handleQuestion = useCallback(({ question, currentPlayerId, playerTimes }: { question: Question; currentPlayerId: string; playerTimes: Record<string, number> }) => {
    setQuestion(question)
    setCurrentPlayerId(currentPlayerId)
    setPlayerTimes(playerTimes)
    setAnswerResult(null)
  }, [])
  const handleAnswerResult = useCallback(({ correct, correctAnswer, submittedAnswer, answeredBy, playerTimes }: { correct: boolean; correctAnswer: string; submittedAnswer: string; answeredBy: string; playerTimes: Record<string, number> }) => {
    setAnswerResult({ correct, correctAnswer, submittedAnswer, answeredBy })
    setPlayerTimes(playerTimes)
  }, [])
  const handleGameOver = useCallback(({ winnerId }: { winnerId: string }) => {
    setWinnerId(winnerId)
    setTimeout(() => navigate('/rooms'), 8000)
  }, [navigate])
  const handlePlayerQuit = useCallback(({ winnerId }: { winnerId: string | null }) => {
    setPlayerQuit(true)
    setWinnerId(winnerId ?? '')
    setTimeout(() => navigate('/rooms'), 8000)
  }, [navigate])

  useSocket('room:details', handleRoomDetails)
  useSocket('game:spectator_state', handleSpectatorState)
  useSocket('game:question', handleQuestion)
  useSocket('game:answer_result', handleAnswerResult)
  useSocket('game:over', handleGameOver)
  useSocket('game:player_quit', handlePlayerQuit)

  const leave = useCallback(() => navigate('/rooms'), [navigate])

  return { room, currentPlayerId, question, answerResult, playerTimes, winnerId, playerQuit, error, leave }
}
