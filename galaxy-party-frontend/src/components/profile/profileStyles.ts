export const INDIGO   = '#818cf8'
export const INDIGO_D = '#4f46e5'
export const ROSE     = '#f472b6'
export const EMERALD  = '#34d399'
export const AMBER    = '#fbbf24'
export const BORDER   = 'rgba(129,140,248,0.22)'
export const PANEL    = 'rgba(12,8,28,0.82)'
export const TEXT     = '#f1f0ff'
export const TEXT_DIM = 'rgba(241,240,255,0.35)'
export const NAVY     = '#051240'
export const BG       = '#07050f'

export type TitleColor = 'indigo' | 'rose' | 'gold' | 'emerald' | 'purple'

export const BADGE_STYLE: Record<TitleColor, React.CSSProperties> = {
    indigo:  { background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.35)', color: INDIGO },
    rose:    { background: 'rgba(244,114,182,0.12)', border: '1px solid rgba(244,114,182,0.35)', color: ROSE },
    gold:    { background: 'rgba(251,191,36,0.12)',  border: '1px solid rgba(251,191,36,0.35)',  color: AMBER },
    emerald: { background: 'rgba(52,211,153,0.12)',  border: '1px solid rgba(52,211,153,0.35)',  color: EMERALD },
    purple:  { background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.35)', color: '#a78bfa' },
}

export function getTitleColor(levelNumber: number): TitleColor {
    if (levelNumber <= 4)  return 'indigo'
    if (levelNumber <= 8)  return 'emerald'
    if (levelNumber <= 12) return 'rose'
    if (levelNumber <= 16) return 'purple'
    return 'gold'
}
