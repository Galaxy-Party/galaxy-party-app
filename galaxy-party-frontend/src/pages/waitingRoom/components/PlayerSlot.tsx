interface Props {
  role: 'host' | 'opponent'
  imageName?: string | null
  username?: string | null
}

/** A row in the waiting room showing a player (or an empty "waiting" slot for the opponent). */
export default function PlayerSlot({ role, imageName, username }: Props) {
  const present = !!username
  const isHost = role === 'host'

  return (
    <div className={`flex items-center gap-4 px-5 py-4 rounded-[16px] border border-border bg-panel/40 ${present ? '' : 'opacity-45'}`}>
      <div className={`w-13 h-13 rounded-full bg-navy border-2 overflow-hidden flex items-center justify-center shrink-0 ${present ? 'border-indigo' : 'border-indigo/30'}`}>
        {present ? (
          <img src={imageName ?? undefined} alt="avatar" className="w-[72%] h-[72%] object-contain" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="stroke-indigo/40 w-[26px] h-[26px]">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        )}
      </div>
      <div>
        <div className={`font-display text-[16px] font-semibold ${present ? 'text-text' : 'text-text-dim'}`}>
          {present ? username : "En attente d'un joueur…"}
        </div>
        <div className={`text-[10px] tracking-[0.12em] uppercase ${isHost ? 'text-indigo' : 'text-indigo/40'}`}>
          {isHost ? 'Hôte' : 'Adversaire'}
        </div>
      </div>
    </div>
  )
}
