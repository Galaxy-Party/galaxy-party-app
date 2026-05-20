interface Props {
  val: number | string
  label: string
  /** Accent color for the value (a theme token string). */
  color: string
}

/** A single labelled statistic tile. */
export default function StatCard({ val, label, color }: Props) {
  return (
    <div className="bg-panel/50 border border-border rounded-[14px] p-[14px] text-center">
      <div className="font-display font-bold text-[22px]" style={{ color }}>{val}</div>
      <div className="text-[11px] text-text-dim mt-1 tracking-[0.08em] uppercase">{label}</div>
    </div>
  )
}
