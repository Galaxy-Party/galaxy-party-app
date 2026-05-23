import { useEffect, useState } from 'react'
import socket from '../../../socket/client'
import { useSocket } from '../../../hooks/useSocket'
import { useUserContext } from '../../../hooks/useUserContext'

export interface LeaderboardEntry {
  id: string
  username: string
  imageName: string | null
  elo: number
}

/** Fetches and keeps the ranked leaderboard in sync (refreshing on ELO changes). */
export function useLeaderboard(): LeaderboardEntry[] {
  const { updateElo } = useUserContext()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

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

  return leaderboard
}
