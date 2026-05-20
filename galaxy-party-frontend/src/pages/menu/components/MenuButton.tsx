/** Pill button for the menu's primary actions. */
export default function MenuButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2.5 rounded-[41px] bg-indigo-deep/15 border border-indigo text-text font-display text-[14px] font-semibold transition-all duration-200 shadow-[0_0_12px_rgba(129,140,248,0.15)]"
    >
      {label}
    </button>
  )
}
