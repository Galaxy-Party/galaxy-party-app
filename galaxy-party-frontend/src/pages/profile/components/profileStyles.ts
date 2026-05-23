export const INDIGO   = 'var(--color-indigo)'
export const INDIGO_D = 'var(--color-indigo-deep)'
export const ROSE     = 'var(--color-rose)'
export const EMERALD  = 'var(--color-emerald)'
export const AMBER    = 'var(--color-amber)'
export const BORDER   = 'var(--color-border)'
export const PANEL    = 'var(--color-panel)'
export const TEXT     = 'var(--color-text)'
export const TEXT_DIM = 'var(--color-text-dim)'
export const NAVY     = 'var(--color-navy)'
export const BG       = 'var(--color-bg)'

export type TitleColor = 'indigo' | 'rose' | 'gold' | 'emerald' | 'purple'

const badge = (color: string, bgPercent: number): React.CSSProperties => ({
    background: `color-mix(in srgb, ${color} ${bgPercent}%, transparent)`,
    border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
    color,
})

export const BADGE_STYLE: Record<TitleColor, React.CSSProperties> = {
    indigo:  badge(INDIGO, 15),
    rose:    badge(ROSE, 12),
    gold:    badge(AMBER, 12),
    emerald: badge(EMERALD, 12),
    purple:  badge('var(--color-purple-light)', 12),
}

export function getTitleColor(levelNumber: number): TitleColor {
    if (levelNumber <= 4)  return 'indigo'
    if (levelNumber <= 8)  return 'emerald'
    if (levelNumber <= 12) return 'rose'
    if (levelNumber <= 16) return 'purple'
    return 'gold'
}
