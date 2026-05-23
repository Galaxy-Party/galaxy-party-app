import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useUserContext } from '../../../hooks/useUserContext'
import { useSocket } from '../../../hooks/useSocket'
import { useToast } from '../../../hooks/useToast'
import socket from '../../../socket/client'
import type { Room } from '../../../types/room/models'
import { gameReducer, initialGameState } from '../gameReducer'

/**
 * Owns all of a game's logic: socket subscriptions, the discrete protocol state
 * (via reducer), the live per-player clock, the rewards (ELO/XP) and the quit flow.
 * The page only consumes the returned view-model + actions.
 */
export function useGameSession() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { user, updateElo } = useUserContext()
  const toast = useToast()

  const rankedFromState = location.state?.isRanked === true
  const [state, dispatch] = useReducer(gameReducer, rankedFromState, initialGameState)

  // The clock is continuous (ticks every second + emits time_up) → kept separate
  // from the discrete reducer state.
  const [playerTimes, setPlayerTimes] = useState<Record<string, number>>({})

  // Read in async socket callbacks, so they always see the latest value.
  const isRankedRef = useRef(rankedFromState)
  const isQuittingRef = useRef(false)
  const quitWinnerIdRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const opponent = state.room?.users.find(u => u.id !== user?.id) ?? null

  // Join the game on mount.
  useEffect(() => {
    if (!id || !user) return
    socket.emit('room:get', id, (err) => { if (err) toast.error(err) })
    socket.emit('game:player_ready', { roomId: id }, (err) => { if (err) toast.error(err) })
  }, [id, user, toast])

  // Tick the active player's clock every second; emit time_up when it reaches zero.
  const { currentPlayerId, answerResult, winnerId } = state

  useEffect(() => {
    if (!currentPlayerId || answerResult !== null || !id || !user || winnerId !== null) return
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
  }, [currentPlayerId, answerResult, winnerId, id, user])

  const handleRoomDetails = useCallback((room: Room) => dispatch({ type: 'ROOM_DETAILS', room }), [])
  const handleCountdown = useCallback((count: number) => dispatch({ type: 'COUNTDOWN', count }), [])
  const handleGameStarted = useCallback(({ currentPlayerId }: { currentPlayerId: string }) => {
    dispatch({ type: 'GAME_STARTED', currentPlayerId })
  }, [])
  const handleQuestion = useCallback(({ question, currentPlayerId, playerTimes }: { question: { id: string; label: string }; currentPlayerId: string; playerTimes: Record<string, number> }) => {
    dispatch({ type: 'QUESTION', question, currentPlayerId })
    setPlayerTimes(playerTimes)
  }, [])
  const handleAnswerResult = useCallback(({ correct, correctAnswer, submittedAnswer, answeredBy, playerTimes }: { correct: boolean; correctAnswer: string; submittedAnswer: string; answeredBy: string; playerTimes: Record<string, number> }) => {
    dispatch({ type: 'ANSWER_RESULT', result: { correct, correctAnswer, submittedAnswer, answeredBy } })
    setPlayerTimes(playerTimes)
  }, [])
  const handleGameOver = useCallback(({ winnerId }: { winnerId: string }) => {
    dispatch({ type: 'GAME_OVER', winnerId })
    if (isRankedRef.current) {
      setTimeout(() => navigate('/ranked'), 6000)
    }
  }, [navigate])
  const handleXpUpdated = useCallback(({ xp, level, leveledUp }: { xp: number; level: number; leveledUp: boolean }) => {
    dispatch({ type: 'XP_UPDATED', xp, level, leveledUp })
  }, [])
  const handleSessionStarted = useCallback(() => {
    isRankedRef.current = true
    dispatch({ type: 'SESSION_STARTED' })
  }, [])
  const handlePlayerQuit = useCallback(({ winnerId: quitWinnerId }: { winnerId: string | null }) => {
    if (isQuittingRef.current) {
      quitWinnerIdRef.current = quitWinnerId
      return
    }
    if (isRankedRef.current && quitWinnerId === user?.id) {
      dispatch({ type: 'GAME_OVER', winnerId: quitWinnerId })
      setTimeout(() => navigate('/ranked'), 6000)
    } else {
      navigate('/rooms')
    }
  }, [navigate, user?.id])
  const handleEloUpdated = useCallback((newElo: number) => {
    dispatch({ type: 'ELO_UPDATED', newElo, currentElo: user?.elo ?? 0 })
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

  const submitAnswer = useCallback((answer: string) => {
    if (state.currentPlayerId !== user?.id || !answer.trim() || !id || !user) return
    socket.emit('game:answer', { roomId: id, answer }, (err) => { if (err) toast.error(err) })
  }, [state.currentPlayerId, user, id, toast])

  const quit = useCallback(() => {
    isQuittingRef.current = true
    socket.emit('game:quit', { roomId: id! }, (err?: string) => {
      if (err) { isQuittingRef.current = false; return }
      if (isRankedRef.current) {
        dispatch({ type: 'GAME_OVER', winnerId: quitWinnerIdRef.current ?? opponent?.id ?? null })
        setTimeout(() => navigate('/ranked'), 6000)
      } else {
        navigate('/rooms')
      }
    })
  }, [id, navigate, opponent?.id])

  const returnTo = useCallback(() => {
    navigate(state.isRanked ? '/ranked' : `/rooms/${id}`)
  }, [navigate, state.isRanked, id])

  return { ...state, playerTimes, opponent, submitAnswer, quit, returnTo }
}
