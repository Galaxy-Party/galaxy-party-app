import { useContext, useMemo } from 'react'
import { ToastContext } from '../context/toast'

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  const { push } = ctx
  return useMemo(() => ({
    error: (msg: string) => push('error', msg),
    success: (msg: string) => push('success', msg),
    info: (msg: string) => push('info', msg),
    warning: (msg: string) => push('warning', msg),
  }), [push])
}

export function useToastState() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastState must be used within ToastProvider')
  return { toasts: ctx.toasts, dismiss: ctx.dismiss }
}
