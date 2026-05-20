import { useEffect, useRef, useState } from 'react'

export interface TurnBanner {
  text: string
  isMine: boolean
  key: number
}

/** Shows a transient "your turn / opponent's turn" banner for 2s whenever the turn changes. */
export function useTurnBanner(currentPlayerId: string | null, userId: string | undefined, opponentName: string): TurnBanner | null {
  const [banner, setBanner] = useState<TurnBanner | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!currentPlayerId) return
    const isMine = currentPlayerId === userId
    const text = isMine ? 'À vous de jouer !' : `Tour de ${opponentName}`
    if (timerRef.current) clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBanner({ text, isMine, key: Date.now() })
    timerRef.current = setTimeout(() => setBanner(null), 2000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [currentPlayerId, userId, opponentName])

  return banner
}
