import Starfield from '../../components/Starfield'
import Nebulae from '../../components/Nebulae'
import QuestionCard from '../../components/QuestionCard'
import TurnTimer from '../../components/TurnTimer'
import SpectatorPlayer from './components/SpectatorPlayer'
import SpectatorGameOverOverlay from './components/SpectatorGameOverOverlay'
import { useSpectatorSession } from './hooks/useSpectatorSession'

export default function SpectatorPage() {
  const { room, currentPlayerId, question, answerResult, playerTimes, winnerId, playerQuit, error, leave } = useSpectatorSession()

  if (error) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-bg flex flex-col items-center justify-center gap-5">
        <Starfield />
        <Nebulae />
        <div className="relative z-[1] text-center">
          <p className="font-display text-[18px] text-rose mb-5">{error}</p>
          <button
            onClick={leave}
            className="px-8 h-12 rounded-[41px] bg-indigo-deep/15 border border-indigo text-text font-display text-[14px] font-semibold"
          >
            Retour aux salons
          </button>
        </div>
      </div>
    )
  }

  const playerLeft = room?.users[0] ?? null
  const playerRight = room?.users[1] ?? null
  const isLeftActive = currentPlayerId === playerLeft?.id
  const leftTime = playerLeft ? (playerTimes[playerLeft.id] ?? 0) : 0
  const rightTime = playerRight ? (playerTimes[playerRight.id] ?? 0) : 0
  const turnLabel = currentPlayerId
    ? `Tour de ${room?.users.find(u => u.id === currentPlayerId)?.username ?? '…'}`
    : '…'

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg flex flex-col items-center justify-center gap-7 px-8 py-5">
      <Starfield />
      <Nebulae />

      {/* Loading overlay */}
      {currentPlayerId === null && (
        <div className="fixed inset-0 z-20 bg-bg/90 flex items-center justify-center">
          <span className="font-display text-[20px] text-text-dim tracking-[0.2em] uppercase">
            Connexion…
          </span>
        </div>
      )}

      {winnerId !== null && (
        <SpectatorGameOverOverlay
          winnerName={room?.users.find(u => u.id === winnerId)?.username ?? null}
          playerQuit={playerQuit}
          onReturn={leave}
        />
      )}

      {/* Back button */}
      <div className="fixed top-6 left-8 z-10">
        <button
          onClick={leave}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-[41px] bg-indigo/8 border border-indigo/40 text-indigo font-display text-[14px] font-semibold transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Quitter
        </button>
      </div>

      {/* Spectator badge */}
      <div className="fixed top-6 right-8 z-10">
        <span className="inline-flex items-center gap-1.5 px-4 h-9 rounded-[41px] bg-amber/8 border border-amber/35 text-amber font-display text-[11px] font-bold tracking-[0.1em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber shadow-[0_0_6px_var(--color-amber)]" />
          Spectateur
        </span>
      </div>

      {/* Players + timer row */}
      <div className="relative z-[1] flex items-center gap-12 w-full max-w-[760px] justify-center">
        <SpectatorPlayer
          active={isLeftActive}
          imageName={playerLeft?.imageName}
          username={playerLeft?.username ?? 'Joueur 1'}
          time={leftTime}
          showTime={!isLeftActive}
          accent="indigo"
        />

        <TurnTimer ms={isLeftActive ? leftTime : rightTime} leftActive={isLeftActive} label={turnLabel} />

        <SpectatorPlayer
          active={!isLeftActive && currentPlayerId !== null}
          imageName={playerRight?.imageName}
          username={playerRight?.username ?? 'Joueur 2'}
          time={rightTime}
          showTime={isLeftActive}
          accent="rose"
        />
      </div>

      <QuestionCard label={question?.label} />

      {/* Answer result (read-only) */}
      {answerResult && (
        <div className="relative z-[1] text-center text-[15px] font-semibold flex flex-col gap-1">
          <span className={answerResult.correct ? 'text-emerald' : 'text-rose'}>
            Réponse : « {answerResult.submittedAnswer} »
          </span>
          {!answerResult.correct && (
            <span className="text-text/55 font-medium">
              La bonne réponse était : {answerResult.correctAnswer}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
