import EditDot from './EditDot'
import { BADGE_STYLE, INDIGO } from './profileStyles'
import type { TitleColor } from './profileStyles'

interface Props {
  imageName?: string | null
  username?: string
  level: number
  levelProgress: number
  xp: number
  nextLevelXp: number | null
  equippedTitle: string | null
  equippedColor: TitleColor
  onEditAvatar: () => void
  onEditTitle: () => void
}

/** Identity block: avatar, username + equipped title, level badge and XP bar. */
export default function ProfileIdentity({
  imageName, username, level, levelProgress, xp, nextLevelXp,
  equippedTitle, equippedColor, onEditAvatar, onEditTitle,
}: Props) {
  return (
    <div className="flex items-center gap-5 mb-7 px-[22px] py-5 bg-panel/50 border border-border rounded-[20px]">

      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          onClick={onEditAvatar}
          className="w-[72px] h-[72px] rounded-full bg-navy border-2 border-indigo hover:border-indigo/90 overflow-hidden flex items-center justify-center cursor-pointer transition-[border-color] duration-200"
        >
          {imageName
            ? <img src={imageName} alt="avatar" className="w-[75%] h-[75%] object-contain" />
            : <svg viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="1.5" className="w-8 h-8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          }
        </div>
        <div className="absolute bottom-0 right-0">
          <EditDot size={22} onClick={onEditAvatar} />
        </div>
      </div>

      {/* Name + title */}
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-[20px] text-text overflow-hidden text-ellipsis whitespace-nowrap">
          {username}
        </div>
        {equippedTitle && (
          <div className="inline-flex items-center gap-1.5 mt-2 cursor-pointer" onClick={onEditTitle}>
            <span className="font-display text-[12px] font-bold py-[3px] px-3 rounded-[20px]" style={BADGE_STYLE[equippedColor]}>
              {equippedTitle}
            </span>
            <EditDot size={20} onClick={onEditTitle} />
          </div>
        )}
      </div>

      {/* Level + XP */}
      <div className="text-right shrink-0">
        <div className="font-display text-[11px] text-text-dim tracking-[0.15em] uppercase mb-1.5">Niveau</div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-deep to-purple flex items-center justify-center font-display text-[15px] font-bold text-white ml-auto shadow-[0_0_8px_rgba(129,140,248,0.4)]">
          {level}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 w-[120px]">
          <div className="flex-1 h-1 rounded-sm bg-indigo/15 overflow-hidden">
            <div className="h-full rounded-sm bg-gradient-to-r from-indigo to-rose transition-[width] duration-[600ms] ease-out" style={{ width: `${levelProgress}%` }} />
          </div>
          <span className="text-[10px] text-text-dim whitespace-nowrap">
            {nextLevelXp !== null ? `${xp}/${nextLevelXp}` : `${xp} XP`}
          </span>
        </div>
      </div>
    </div>
  )
}
