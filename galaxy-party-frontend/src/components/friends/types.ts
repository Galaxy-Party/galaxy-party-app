import type { FriendStatus, ChatMessage } from '../../types/sockets'

export type { FriendStatus, ChatMessage }

export const STATUS_DOT: Record<FriendStatus, string> = {
  online:  'bg-[#34d399] shadow-[0_0_4px_#34d399]',
  ingame:  'bg-[#f59e0b] shadow-[0_0_4px_#f59e0b]',
  offline: 'bg-[rgba(241,240,255,0.2)]',
}

export const STATUS_TEXT: Record<FriendStatus, string> = {
  online:  'text-[#34d399]',
  ingame:  'text-[#f59e0b]',
  offline: 'text-[rgba(241,240,255,0.35)]',
}

export const STATUS_LABEL: Record<FriendStatus, string> = {
  online:  'En ligne',
  ingame:  'En partie',
  offline: 'Hors ligne',
}

export interface ActiveChat {
  userId: string
  username: string
  imageName: string | null
  messages: ChatMessage[]
}
