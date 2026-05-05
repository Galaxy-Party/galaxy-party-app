import socket from '../socket/client'

interface Invite {
  inviteId: string
  fromUserId: string
  fromUsername: string
  fromImageName: string | null
}

interface Props {
  invite: Invite
  onAccept: (roomId: string) => void
  onDecline: () => void
}

export default function GameInviteNotif({ invite, onAccept, onDecline }: Props) {
  const accept = () => {
    socket.emit('friend:invite_accept', invite.inviteId, (_, roomId) => {
      if (roomId) onAccept(roomId)
    })
  }

  const decline = () => {
    socket.emit('friend:invite_decline', invite.inviteId, () => {})
    onDecline()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 card-in w-[320px] bg-[rgba(12,8,28,0.97)] backdrop-blur-[28px] border border-[rgba(129,140,248,0.35)] rounded-[20px] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#051240] border-2 border-[#818cf8] overflow-hidden flex items-center justify-center shrink-0">
          {invite.fromImageName
            ? <img src={invite.fromImageName} alt="" className="w-[80%] h-[80%] object-contain" />
            : <svg viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" width="20" height="20">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-sm text-[#f1f0ff] truncate">{invite.fromUsername}</div>
          <div className="text-xs text-[rgba(241,240,255,0.5)] mt-[2px]">vous invite à jouer</div>
        </div>
        <div className="ml-auto">
          <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" width="18" height="18">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={accept}
          className="flex-1 h-9 rounded-[10px] bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white font-display text-[13px] font-semibold transition-all duration-200"
        >
          Accepter
        </button>
        <button
          onClick={decline}
          className="flex-1 h-9 rounded-[10px] border border-[rgba(129,140,248,0.3)] bg-transparent text-[rgba(241,240,255,0.5)] font-display text-[13px] hover:border-[rgba(244,114,182,0.4)] hover:text-[#f472b6] transition-all duration-200"
        >
          Refuser
        </button>
      </div>
    </div>
  )
}
