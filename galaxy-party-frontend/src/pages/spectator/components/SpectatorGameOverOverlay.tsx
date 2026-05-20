interface Props {
  winnerName: string | null
  playerQuit: boolean
  onReturn: () => void
}

/** End-of-game overlay shown to spectators (winner or a player having quit). */
export default function SpectatorGameOverOverlay({ winnerName, playerQuit, onReturn }: Props) {
  return (
    <div className="fixed inset-0 z-30 bg-bg/92 flex items-center justify-center">
      <div className="card-in bg-panel/96 border border-border rounded-[28px] px-16 py-12 flex flex-col items-center gap-4 shadow-[0_32px_80px_rgba(0,0,0,0.7)] text-center min-w-[340px]">
        <div className="font-display font-bold text-[48px] text-indigo [text-shadow:0_0_32px_rgba(129,140,248,0.4)]">
          Partie terminée
        </div>
        {playerQuit ? (
          <>
            <div className="text-[15px] text-text/60">
              Un joueur a quitté la partie.
            </div>
            {winnerName && (
              <div className="flex items-center gap-2 px-[18px] py-2 rounded-[12px] bg-indigo/8 border border-indigo/25">
                <span className="font-display text-[13px] text-text/40">Vainqueur</span>
                <span className="font-display font-bold text-[16px] text-indigo">{winnerName}</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-[15px] text-text/60">
            {winnerName ? <><span className="font-display font-bold text-indigo">{winnerName}</span> a gagné !</> : 'La partie est terminée.'}
          </div>
        )}
        <div className="mt-1 text-[12px] text-text/25">
          Redirection automatique dans quelques secondes…
        </div>
        <button
          onClick={onReturn}
          className="mt-2 px-10 h-[50px] rounded-[41px] bg-indigo-deep/15 border border-indigo text-text font-display text-[15px] font-semibold transition-all duration-200"
        >
          Retour aux salons
        </button>
      </div>
    </div>
  )
}
