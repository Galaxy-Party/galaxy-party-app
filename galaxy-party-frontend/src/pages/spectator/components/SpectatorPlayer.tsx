import { formatTime } from '../../../utils/time'

interface Props {
  active: boolean
  imageName?: string | null
  username: string
  time: number
  showTime: boolean
  accent: 'indigo' | 'rose'
}

/** Spectator-side player slot: avatar with an active ring, name and remaining time. */
export default function SpectatorPlayer({ active, imageName, username, time, showTime, accent }: Props) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className={active ? 'rounded-full shadow-[0_0_0_3px_var(--color-indigo),0_0_24px_rgba(129,140,248,0.5)]' : 'rounded-full opacity-50 shadow-[0_0_0_2px_rgba(78,128,152,0.4)]'}>
        <div className="w-[140px] h-[140px] rounded-full bg-navy overflow-hidden flex items-center justify-center">
          {imageName ? (
            <img src={imageName} alt="avatar" className="w-[72%] h-[72%] object-contain" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="stroke-indigo/50 w-20 h-20">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          )}
        </div>
      </div>
      <div className={`font-display text-[14px] font-semibold transition-colors duration-300 ${active ? (accent === 'indigo' ? 'text-indigo' : 'text-rose') : 'text-text-dim'}`}>
        {username}
      </div>
      {showTime && (
        <div className="font-display text-[18px] font-bold text-text-dim">
          {formatTime(time)}
        </div>
      )}
    </div>
  )
}
