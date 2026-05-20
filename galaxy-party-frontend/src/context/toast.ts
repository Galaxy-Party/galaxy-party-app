import { createContext } from 'react'

export type ToastType = 'error' | 'success' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  removing: boolean
}

export interface ToastContextValue {
  toasts: Toast[]
  push: (type: ToastType, message: string) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)