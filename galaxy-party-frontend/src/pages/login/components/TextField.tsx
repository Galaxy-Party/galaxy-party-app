interface Props {
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  autoComplete?: string
  error?: string
  onBlur?: () => void
  onSubmit?: () => void
}

/** Labelled text input for the auth forms, with an error state. */
export default function TextField({ label, type, value, onChange, placeholder, autoFocus, autoComplete, error, onBlur, onSubmit }: Props) {
  return (
    <>
      <label className="block font-display text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim mb-2">{label}</label>
      <input
        type={type}
        value={value}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={e => { if (e.key === 'Enter') onSubmit?.() }}
        className={`w-full bg-indigo/6 border rounded-[14px] px-[18px] py-[14px] text-text text-[15px] font-medium outline-none box-border transition-[border-color,box-shadow] duration-200 placeholder:text-text-dim ${error ? 'border-danger/40 focus:border-danger/75 focus:shadow-[0_0_0_3px_rgba(252,165,165,0.08)]' : 'border-border focus:border-indigo focus:shadow-[0_0_0_3px_rgba(129,140,248,0.1)]'}`}
      />
      {error && <p className="text-danger text-xs mt-[6px]">{error}</p>}
    </>
  )
}
