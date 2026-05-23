import { useState } from 'react'
import { useSocket } from '../../../hooks/useSocket'
import { useUserContext } from '../../../hooks/useUserContext'
import { useLevels } from '../../../hooks/useLevels'

/**
 * Live profile updates: applies ELO changes to the user context and surfaces a
 * transient "level up" message. Returns the message to display (or null).
 */
export function useProfileLiveUpdates(): string | null {
  const { updateElo } = useUserContext()
  const levels = useLevels()
  const [leveledUpMsg, setLeveledUpMsg] = useState<string | null>(null)

  useSocket('profile:xp_updated', ({ level, leveledUp }) => {
    if (!leveledUp) return
    const title = levels.find(l => l.levelNumber === level)?.title
    setLeveledUpMsg(`Niveau ${level} atteint${title ? ` — "${title}" débloqué` : ''} !`)
    setTimeout(() => setLeveledUpMsg(null), 5000)
  })

  useSocket('ranked:elo_updated', updateElo)

  return leveledUpMsg
}
