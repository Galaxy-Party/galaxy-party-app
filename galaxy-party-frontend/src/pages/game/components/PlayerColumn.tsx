import { formatTime } from '../../../utils/time'

interface Props {
  active: boolean
  imageName?: string | null
  username: string
  time: number
  showTime: boolean
  accent: 'indigo' | 'rose'
}

/** A player's avatar (with rotating aura when active), name and remaining time. */
export default function PlayerColumn({ active, imageName, username, time, showTime, accent }: Props) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative w-[220px] h-[220px] flex items-center justify-center">
        {active && (
          <>
            <div className="absolute inset-5 rounded-full halo-aura animate-[haloRot_6s_linear_infinite,haloAuraBreath_2.4s_ease-in-out_infinite] z-[1]" />
            <div className="absolute inset-8 rounded-full halo-aura-inner animate-[haloRotR_9s_linear_infinite] z-[1]" />
          </>
        )}
        <div className={`relative z-[2] w-[140px] h-[140px] rounded-full bg-navy overflow-hidden flex items-center justify-center border-2 transition-[opacity,border-color] duration-300 ${active ? `${accent === 'indigo' ? 'border-indigo' : 'border-rose'} opacity-100` : 'border-[rgba(78,128,152,0.4)] opacity-55'}`}>
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
