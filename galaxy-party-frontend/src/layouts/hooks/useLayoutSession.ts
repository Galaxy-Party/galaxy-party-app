import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../../socket/client'
import { useUserContext } from '../../hooks/useUserContext'
import { useToast } from '../../hooks/useToast'

export interface GameInvite {
  inviteId: string
  fromUserId: string
  fromUsername: string
  fromImageName: string | null
}

/**
 * App-shell live signals: the friends notification dot, incoming game invites, and
 * ELO updates applied to the user context. `friendsOpen` suppresses the dot while open.
 */
export function useLayoutSession(friendsOpen: boolean) {
  const { updateElo } = useUserContext()
  const navigate = useNavigate()
  const toast = useToast()
  const [hasNotif, setHasNotif] = useState(false)
  const [gameInvite, setGameInvite] = useState<GameInvite | null>(null)

  useEffect(() => {
    const onList = ({ requests }: { requests: unknown[] }) => {
      if (!friendsOpen) setHasNotif(requests.length > 0)
    }
    const onRequested = () => { if (!friendsOpen) setHasNotif(true) }
    const onMessage = () => { if (!friendsOpen) setHasNotif(true) }
    const onInvite = (invite: GameInvite) => setGameInvite(invite)
    const onInviteAccepted = (roomId: string) => {
      setGameInvite(null)
      navigate(`/rooms/${roomId}`)
    }
    const onEloUpdated = (newElo: number) => updateElo(newElo)

    socket.on('friend:list', onList)
    socket.on('friend:requested', onRequested)
    socket.on('message:received', onMessage)
    socket.on('friend:game_invite', onInvite)
    socket.on('friend:invite_accepted', onInviteAccepted)
    socket.on('ranked:elo_updated', onEloUpdated)
    return () => {
      socket.off('friend:list', onList)
      socket.off('friend:requested', onRequested)
      socket.off('message:received', onMessage)
      socket.off('friend:game_invite', onInvite)
      socket.off('friend:invite_accepted', onInviteAccepted)
      socket.off('ranked:elo_updated', onEloUpdated)
    }
  }, [friendsOpen, navigate, updateElo])

  const respondAccept = useCallback((inviteId: string) => {
    socket.emit('friend:invite_accept', inviteId, (err, roomId) => {
      if (err) { toast.error(err); return }
      if (roomId) {
        setGameInvite(null)
        navigate(`/rooms/${roomId}`)
      }
    })
  }, [navigate, toast])

  const respondDecline = useCallback((inviteId: string) => {
    socket.emit('friend:invite_decline', inviteId, () => {})
    setGameInvite(null)
  }, [])

  return {
    hasNotif,
    clearNotif: () => setHasNotif(false),
    gameInvite,
    respondAccept,
    respondDecline,
  }
}
