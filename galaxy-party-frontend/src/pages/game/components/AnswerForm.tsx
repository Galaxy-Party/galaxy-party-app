import { useEffect, useRef, useState } from 'react'

interface AnswerResult {
  correct: boolean
  correctAnswer: string
  submittedAnswer: string
  answeredBy: string
}

interface Props {
  onSubmit: (answer: string) => void
  disabled: boolean
  result: AnswerResult | null
  myId?: string
}

/**
 * Answer input + submit button, with the reveal of the last answer's result.
 *
 * The component owns its own input state and auto-focuses on mount. The parent
 * is expected to remount it on each new question via `key={question.id}`, which
 * clears the input and re-focuses cleanly without a setState-in-effect.
 */
export default function AnswerForm({ onSubmit, disabled, result, myId }: Props) {
  const [answer, setAnswer] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [])

  const submit = () => onSubmit(answer)

  return (
    <div className="relative z-[1] w-full max-w-[520px] flex flex-col items-center gap-5">
      {result && (
        <div className="text-center text-[15px] font-semibold flex flex-col gap-1">
          <span className={result.correct ? 'text-emerald' : 'text-rose'}>
            {result.answeredBy === myId ? 'Ta réponse' : 'Réponse adverse'} : « {result.submittedAnswer} »
          </span>
          {!result.correct && (
            <span className="text-text/55 font-medium">
              La bonne réponse était : {result.correctAnswer}
            </span>
          )}
        </div>
      )}
      <input
        type="text"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder="Votre réponse…"
        ref={inputRef}
        disabled={disabled}
        className="w-full bg-transparent border-0 border-b-2 border-indigo text-text text-[20px] font-medium text-center outline-none pb-2.5 disabled:opacity-30"
      />
      <button
        disabled={disabled}
        onClick={submit}
        className="px-12 h-13 rounded-[41px] bg-indigo-deep/15 border border-indigo text-text font-display text-[14px] font-semibold tracking-[0.06em] uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Valider
      </button>
    </div>
  )
}
