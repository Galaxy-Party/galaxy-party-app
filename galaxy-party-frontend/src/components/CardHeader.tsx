import type { ReactNode } from 'react'

interface Props {
  /** Icon SVG; use `stroke="currentColor"` so it inherits the accent color. */
  icon: ReactNode
  title: ReactNode
  accent?: 'indigo' | 'amber'
  /** Optional element pinned to the right of the header (search input, action button…). */
  right?: ReactNode
}

/** Standard panel header: an accented icon box, a title, and an optional right slot. */
export default function CardHeader({ icon, title, accent = 'indigo', right }: Props) {
  return (
    <div className="px-8 pt-5 pb-4 border-b border-indigo/12 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 ${accent === 'amber' ? 'bg-amber/10 border border-amber/25 text-amber' : 'bg-indigo/10 border border-indigo/25 text-indigo'}`}>
        {icon}
      </div>
      <span className="font-display font-bold text-[17px] tracking-[0.02em] text-text flex-1">{title}</span>
      {right}
    </div>
  )
}
