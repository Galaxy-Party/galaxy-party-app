import { formatTime } from '../../../utils/time'

interface Props {
  isOwner: boolean
  timer: number
  onTimerChange: (ms: number) => void
  onTimerCommit: (ms: number) => void
  isPrivate: boolean
  password: string
  onPasswordChange: (value: string) => void
  onSelectPublic: () => void
  onSelectPrivate: () => void
  onSavePassword: () => void
}

/** Owner-only room settings: turn timer and public/private toggle with password. */
export default function RoomSettings({
  isOwner, timer, onTimerChange, onTimerCommit,
  isPrivate, password, onPasswordChange, onSelectPublic, onSelectPrivate, onSavePassword,
}: Props) {
  return (
    <div className={`w-[280px] shrink-0 bg-panel/50 border border-border rounded-[20px] px-[22px] py-5 ${isOwner ? '' : 'opacity-50 pointer-events-none'}`}>
      <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-indigo mb-[18px]">
        Paramètres
      </div>

      {/* Timer */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[13px] text-text/72">Timer</span>
          <span className="font-display text-[13px] font-semibold text-indigo">{formatTime(timer)}</span>
        </div>
        <input
          type="range"
          min={60000} max={300000} step={15000}
          value={timer}
          onChange={e => onTimerChange(Number(e.target.value))}
          onMouseUp={e => onTimerCommit(Number((e.target as HTMLInputElement).value))}
          onTouchEnd={e => onTimerCommit(Number((e.target as HTMLInputElement).value))}
          className="w-full cursor-pointer accent-indigo"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-text-dim">1:00</span>
          <span className="text-[9px] text-text-dim">5:00</span>
        </div>
      </div>

      {/* Public/Privé */}
      <div>
        <div className="mb-2 text-[13px] text-text/72">Salon</div>
        <div className="flex bg-panel/60 rounded-[10px] p-[3px] border border-border">
          <button
            disabled={!isOwner}
            onClick={onSelectPublic}
            className={`flex-1 px-3 py-1.5 rounded-[8px] border-0 text-[13px] font-medium transition-all duration-200 ${!isPrivate ? 'bg-indigo/20 text-indigo' : 'bg-transparent text-text-dim'} ${isOwner ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            Public
          </button>
          <button
            disabled={!isOwner}
            onClick={onSelectPrivate}
            className={`flex-1 px-3 py-1.5 rounded-[8px] border-0 text-[13px] font-medium transition-all duration-200 ${isPrivate ? 'bg-indigo/20 text-indigo' : 'bg-transparent text-text-dim'} ${isOwner ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            Privé
          </button>
        </div>
        {isPrivate && (
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              value={password}
              onChange={e => onPasswordChange(e.target.value)}
              placeholder="Mot de passe…"
              disabled={!isOwner}
              className="flex-1 bg-indigo/6 border border-border rounded-[8px] px-3.5 py-2.5 text-text text-[14px] outline-none"
            />
            {isOwner && (
              <button
                onClick={onSavePassword}
                className="px-3 py-2 rounded-[8px] border border-indigo bg-indigo/15 text-indigo transition-all duration-200 shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
