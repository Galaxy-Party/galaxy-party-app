import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../../../socket/client'
import { useSocket } from '../../../hooks/useSocket'

export type Phase = 'searching' | 'found' | 'countdown'

export interface MatchOpponent {
  userId: string
  username: string
  imageName: string | null
  elo: number
}

/** Drives the ranked queue: join on mount, handle the match, run the pre-game countdown. */
export function useMatchmaking() {
  const navigate = useNavigate()
  const [elapsed, setElapsed] = useState(0)
  const [phase, setPhase] = useState<Phase>('searching')
  const [countdown, setCountdown] = useState(3)
  const [opponent, setOpponent] = useState<MatchOpponent | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const cancelledRef = useRef(false)

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
        setTimeout(() => navigate(`/rooms/${roomId}/game`, { state: { isRanked: true } }), 300)
      }
    }, 1000)
    return () => clearInterval(cd)
  }, [phase, roomId, navigate])

  const cancel = useCallback(() => {
    cancelledRef.current = true
    socket.emit('ranked:leave_queue', () => {})
    navigate('/ranked')
  }, [navigate])

  return { elapsed, phase, countdown, opponent, cancel }
}
