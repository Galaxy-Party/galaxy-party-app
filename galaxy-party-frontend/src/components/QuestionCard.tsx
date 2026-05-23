/** Read-only card displaying the current question label (shared by the game and spectator views). */
export default function QuestionCard({ label }: { label?: string }) {
  return (
    <div className="relative z-[1] w-full max-w-[660px] bg-panel/75 border border-border rounded-[20px] px-8 py-6 text-center backdrop-blur-[12px]">
      <p className="text-[18px] text-text/72 leading-[1.6]">
        {label ?? '…'}
      </p>
    </div>
  )
}
