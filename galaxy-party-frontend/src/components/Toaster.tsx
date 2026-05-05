import { useToastState } from '../hooks/useToast'
import type { ToastType } from '../context/toast'

const STYLES: Record<ToastType, { border: string; icon: string; glow: string }> = {
  error:   { border: 'border-l-[#f472b6] border-[rgba(244,114,182,0.2)]',   icon: 'text-[#f472b6]',  glow: 'shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(244,114,182,0.08)]' },
  success: { border: 'border-l-[#34d399] border-[rgba(52,211,153,0.2)]',    icon: 'text-[#34d399]',  glow: 'shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(52,211,153,0.08)]'  },
  warning: { border: 'border-l-[#fbbf24] border-[rgba(251,191,36,0.2)]',    icon: 'text-[#fbbf24]',  glow: 'shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(251,191,36,0.08)]'  },
  info:    { border: 'border-l-[#818cf8] border-[rgba(129,140,248,0.2)]',   icon: 'text-[#818cf8]',  glow: 'shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(129,140,248,0.08)]' },
}

const ICONS: Record<ToastType, React.ReactNode> = {
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0 mt-[1px]">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0 mt-[1px]">
      <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0 mt-[1px]">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0 mt-[1px]">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5"/><line x1="12" y1="12" x2="12" y2="16"/>
    </svg>
  ),
}

export default function Toaster() {
  const { toasts, dismiss } = useToastState()

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-[10px] pointer-events-none">
      {toasts.map(toast => {
        const { border, icon, glow } = STYLES[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 min-w-[300px] max-w-[420px] bg-[rgba(8,5,20,0.97)] backdrop-blur-[20px] border border-l-[3px] rounded-[14px] px-4 py-[13px] pointer-events-auto ${border} ${glow} ${icon}`}
            style={{ animation: toast.removing ? 'toast-out 0.28s ease forwards' : 'toast-in 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
          >
            {ICONS[toast.type]}
            <span className="flex-1 text-sm leading-[1.5] text-[#f1f0ff] break-words">
              {toast.message}
            </span>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 flex items-center justify-center w-5 h-5 rounded-md text-[rgba(241,240,255,0.35)] hover:text-[rgba(241,240,255,0.8)] transition-colors duration-150 mt-[1px]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-[13px] h-[13px]">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}