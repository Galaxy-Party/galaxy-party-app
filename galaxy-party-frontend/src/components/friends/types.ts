import type { FriendStatus, ChatMessage } from '../../types/sockets'

export type { FriendStatus, ChatMessage }

export const STATUS_DOT: Record<FriendStatus, string> = {
  online:  'bg-emerald shadow-[0_0_4px_var(--color-emerald)]',
  inroom:  'bg-indigo shadow-[0_0_4px_var(--color-indigo)]',
  ingame:  'bg-amber-deep shadow-[0_0_4px_var(--color-amber-deep)]',
  offline: 'bg-text/20',
}

export const STATUS_TEXT: Record<FriendStatus, string> = {
  online:  'text-emerald',
  inroom:  'text-indigo',
  ingame:  'text-amber-deep',
  offline: 'text-text-dim',
}

export const STATUS_LABEL: Record<FriendStatus, string> = {
  online:  'En ligne',
  inroom:  'Dans un salon',
  ingame:  'En jeu',
  offline: 'Hors ligne',
}

export interface ActiveChat {
  userId: string
  username: string
  imageName: string | null
  messages: ChatMessage[]
}
