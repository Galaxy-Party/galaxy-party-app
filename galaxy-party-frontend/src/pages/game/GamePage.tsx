import { useUserContext } from '../../hooks/useUserContext'
import { useLevels } from '../../hooks/useLevels'
import Starfield from '../../components/Starfield'
import Nebulae from '../../components/Nebulae'
import QuestionCard from '../../components/QuestionCard'
import TurnTimer from '../../components/TurnTimer'
import TurnBanner from './components/TurnBanner'
import GameOverOverlay from './components/GameOverOverlay'
import PlayerColumn from './components/PlayerColumn'
import AnswerForm from './components/AnswerForm'
import { useGameSession } from './hooks/useGameSession'
import { useTurnBanner } from './hooks/useTurnBanner'

export default function GamePage() {
  const { user } = useUserContext()
  const levels = useLevels()
  const game = useGameSession()

  const banner = useTurnBanner(game.currentPlayerId, user?.id, game.opponent?.username ?? 'l\'adversaire')

  const isMyTurn = game.currentPlayerId === user?.id
  const myTime = user ? (game.playerTimes[user.id] ?? 0) : 0
  const opponentTime = game.opponent ? (game.playerTimes[game.opponent.id] ?? 0) : 0
  const answerLocked = !isMyTurn || game.answerResult !== null

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg flex flex-col items-center justify-center gap-7 px-8 py-5">
      <Starfield />
      <Nebulae />

      {banner && <TurnBanner key={banner.key} text={banner.text} isMine={banner.isMine} />}

      {/* Loading overlay */}
      {game.currentPlayerId === null && game.countdown === null && (
        <div className="fixed inset-0 z-20 bg-bg/90 flex items-center justify-center">
          <span className="font-display text-[20px] text-text-dim tracking-[0.2em] uppercase">
            Chargement…
          </span>
        </div>
      )}

      {/* Countdown overlay */}
      {game.countdown !== null && (
        <div className="fixed inset-0 z-20 bg-bg/85 flex items-center justify-center">
          <span className="font-display font-bold text-[10rem] leading-none text-indigo [text-shadow:0_0_40px_rgba(129,140,248,0.5)]">
            {game.countdown}
          </span>
        </div>
      )}

      {game.winnerId !== null && (
        <GameOverOverlay
          winnerId={game.winnerId}
          user={user}
          room={game.room}
          isRanked={game.isRanked}
          eloChange={game.eloChange}
          xpUpdate={game.xpUpdate}
          levels={levels}
          onReturn={game.returnTo}
        />
      )}

      {/* Quit button */}
      <div className="fixed top-6 left-8 z-10">
        <button
          onClick={game.quit}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-[41px] bg-rose/8 border border-rose/40 text-rose font-display text-[14px] font-semibold transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Quitter la partie
        </button>
      </div>

      {/* Players + timer row */}
      <div className="relative z-[1] flex items-center gap-12 w-full max-w-[760px] justify-center">
        <PlayerColumn
          active={isMyTurn}
          imageName={user?.imageName}
          username={user?.username ?? 'Joueur 1'}
          time={myTime}
          showTime={!isMyTurn}
          accent="indigo"
        />

        <TurnTimer
          ms={isMyTurn ? myTime : opponentTime}
          leftActive={isMyTurn}
          label={isMyTurn ? `Tour de ${user?.username ?? 'Joueur 1'}` : `Tour de ${game.opponent?.username ?? 'Joueur 2'}`}
        />

        <PlayerColumn
          active={!isMyTurn}
          imageName={game.opponent?.imageName}
          username={game.opponent?.username ?? 'Joueur 2'}
          time={opponentTime}
          showTime={isMyTurn}
          accent="rose"
        />
      </div>

      <QuestionCard label={game.question?.label} />

      <AnswerForm
        key={game.question?.id}
        onSubmit={game.submitAnswer}
        disabled={answerLocked}
        result={game.answerResult}
        myId={user?.id}
      />
    </div>
  )
}
