import { formatTime } from '../utils/time'

interface Props {
  ms: number
  /** When true the timer is tinted indigo (left/own player), otherwise rose (right/opponent). */
  leftActive: boolean
  label: string
}

/** Large central countdown showing the active player's remaining time. */
export default function TurnTimer({ ms, leftActive, label }: Props) {
  return (
    <div className="text-center">
      <div className={`font-display font-bold text-[88px] leading-none tracking-[-0.02em] transition-colors duration-300 ${leftActive ? 'text-indigo' : 'text-rose/80'}`}>
        {formatTime(ms)}
      </div>
      <div className="text-[11px] tracking-[0.2em] uppercase text-text-dim mt-1">
        {label}
      </div>
    </div>
  )
}
