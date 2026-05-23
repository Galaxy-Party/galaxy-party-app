/** Transient centered banner announcing whose turn it is. */
export default function TurnBanner({ text, isMine }: { text: string; isMine: boolean }) {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] pointer-events-none animate-[turnBanner_2s_ease_forwards]">
      <div className={`px-8 py-3.5 rounded-[41px] border-[1.5px] backdrop-blur-[12px] font-display font-bold text-[20px] tracking-[0.02em] whitespace-nowrap ${isMine ? 'bg-indigo/12 border-indigo/60 shadow-[0_0_32px_rgba(129,140,248,0.25)] text-indigo' : 'bg-rose/10 border-rose/60 shadow-[0_0_32px_rgba(244,114,182,0.2)] text-rose'}`}>
        {text}
      </div>
    </div>
  )
}
