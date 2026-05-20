import { useState } from 'react'
import Starfield from '../../components/Starfield'
import Nebulae from '../../components/Nebulae'
import ReturnMenuModal from '../../components/ReturnMenuModal'
import PlayerSlot from './components/PlayerSlot'
import RoomSettings from './components/RoomSettings'
import { useWaitingRoom } from './hooks/useWaitingRoom'

export default function WaitingRoomPage() {
  const [showReturnModal, setShowReturnModal] = useState(false)
  const wr = useWaitingRoom()

  if (!wr.room) return null
  const { room, isOwner, owner, opponent, canStart, timer, isPrivate, password, isStarting } = wr

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg flex flex-col">
      <Starfield />
      <Nebulae teal />

      {/* Quit button */}
      <button
        onClick={() => room.users.length === 1 ? setShowReturnModal(true) : wr.leave()}
        className="absolute top-5 left-7 z-10 inline-flex items-center gap-2 px-[18px] py-2 rounded-[30px] bg-rose/8 border border-rose/30 text-rose text-[13px] font-medium transition-all duration-200"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>Quitter le salon</span>
      </button>

      {/* Header */}
      <div className="relative z-[1] w-full flex justify-center px-8 pt-5 shrink-0">
        <span className="font-display font-bold text-[17px] tracking-[0.08em] uppercase bg-gradient-to-r from-indigo to-rose bg-clip-text text-transparent">
          Galaxy Party
        </span>
      </div>

      {/* Content */}
      <div className="relative z-[1] flex-1 flex items-center justify-center px-8 pt-4 pb-6">
        <div className="card-in w-full max-w-[1100px] bg-panel/82 backdrop-blur-[28px] border border-border rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
          {/* Card header */}
          <div className="px-8 pt-[22px] pb-4 border-b border-indigo/12 text-center">
            <div className="font-display font-bold text-[22px] text-indigo">
              {room.name}
            </div>
          </div>

          {/* Card body */}
          <div className="px-8 py-7 flex gap-6">
            {/* Players */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="font-display text-[10px] font-bold tracking-[0.18em] uppercase text-indigo mb-1">
                Joueurs
              </div>
              <PlayerSlot role="host" imageName={owner?.imageName} username={owner?.username} />
              <PlayerSlot role="opponent" imageName={opponent?.imageName} username={opponent?.username} />
            </div>

            <RoomSettings
              isOwner={isOwner}
              timer={timer}
              onTimerChange={wr.setTimer}
              onTimerCommit={wr.commitTimer}
              isPrivate={isPrivate}
              password={password}
              onPasswordChange={wr.setPassword}
              onSelectPublic={wr.selectPublic}
              onSelectPrivate={wr.selectPrivate}
              onSavePassword={wr.savePassword}
            />
          </div>

          {/* Footer */}
          <div className="px-8 pt-5 pb-7 flex justify-between items-center border-t border-indigo/10">
            <div className="text-[13px] text-text-dim">
              {opponent ? '2 joueurs connectés' : "En attente d'un adversaire…"}
            </div>
            <button
              disabled={!canStart || isStarting}
              onClick={wr.startGame}
              className={`inline-flex items-center justify-center gap-2.5 px-8 h-13 rounded-[41px] bg-indigo-deep/15 border border-indigo text-text font-display text-[15px] font-semibold transition-all duration-200 ${canStart ? 'opacity-100' : 'opacity-35'} ${canStart && !isStarting ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {isStarting && (
                <svg className="w-[18px] h-[18px] animate-[spin_0.8s_linear_infinite] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              )}
              {isStarting ? 'Lancement…' : 'Lancer la partie'}
            </button>
          </div>
        </div>
      </div>

      {showReturnModal && (
        <ReturnMenuModal
          onClose={() => setShowReturnModal(false)}
          onConfirm={wr.leave}
        />
      )}
    </div>
  )
}
