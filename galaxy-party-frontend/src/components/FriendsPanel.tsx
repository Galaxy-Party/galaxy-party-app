import { useState } from 'react'
import { useUserContext } from '../hooks/useUserContext'
import FriendRow from './friends/FriendRow'
import FriendRequestRow from './friends/FriendRequestRow'
import FriendChat from './friends/FriendChat'
import { useFriends } from './friends/useFriends'
import { useFriendChat } from './friends/useFriendChat'

interface Props {
  open: boolean
  onClose: () => void
}

export default function FriendsPanel({ open, onClose }: Props) {
  const { user } = useUserContext()
  const [tab, setTab] = useState<'friends' | 'requests'>('friends')
  const [addVal, setAddVal] = useState('')

  const { friends, requests, sendRequest, acceptRequest, declineRequest, inviteToGame } = useFriends()
  const { activeChat, openChat, closeChat, sendMessage, hasUnread } = useFriendChat()

  const submitRequest = () => sendRequest(addVal, () => setAddVal(''))

  const online = friends.filter(f => f.status !== 'offline')
  const offline = friends.filter(f => f.status === 'offline')

  return (
    <div className={`fixed top-0 right-0 bottom-0 w-[340px] z-30 bg-[rgba(8,5,20,0.97)] backdrop-blur-[28px] border-l border-border flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}>

      <div className="flex items-center gap-3 px-5 pt-[22px] pb-4 border-b border-border shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-indigo" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
          <path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.85"/>
        </svg>
        <span className="font-display font-bold text-[17px] text-text flex-1">Amis</span>
        {requests.length > 0 && <div className="w-2 h-2 rounded-full bg-rose shadow-[0_0_6px_var(--color-rose)]" />}
        <button onClick={onClose} className="w-8 h-8 rounded-full border border-border bg-transparent flex items-center justify-center text-text-dim hover:bg-rose/10 hover:text-rose hover:border-rose/30 transition-all duration-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="px-5 py-[14px] border-b border-border shrink-0">
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 bg-indigo/6 border border-border rounded-xl px-[14px] py-[10px] text-text text-sm outline-none transition-all duration-200 placeholder:text-text-dim focus:border-indigo focus:shadow-[0_0_0_2px_rgba(129,140,248,0.1)]"
            placeholder="Ajouter un ami par pseudo…"
            value={addVal}
            onChange={e => setAddVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitRequest()}
          />
          <button onClick={submitRequest} className="w-[38px] h-[38px] rounded-[10px] border border-indigo bg-indigo-deep/15 text-indigo flex items-center justify-center shrink-0 hover:bg-indigo-deep/30 transition-all duration-200">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex gap-1 px-5 pt-3 shrink-0">
        {(['friends', 'requests'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-[7px] border-0 bg-transparent text-[13px] font-medium border-b-2 transition-all duration-200 ${tab === t ? 'text-indigo border-b-indigo' : 'text-text-dim border-b-transparent'}`}>
            {t === 'friends' ? `Amis (${online.length} actifs)` : `Demandes${requests.length > 0 ? ` (${requests.length})` : ''}`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-indigo">
        {tab === 'friends' && (
          <>
            {online.length > 0 && (
              <>
                <div className="font-display text-[10px] font-bold tracking-[0.18em] uppercase text-text-dim px-[7px] pb-[6px] pt-[14px]">Disponibles — {online.length}</div>
                {online.map(f => <FriendRow key={f.id} friend={f} hasUnread={hasUnread(f.id)} onOpenChat={openChat} onInviteToGame={inviteToGame} />)}
              </>
            )}
            {offline.length > 0 && (
              <>
                <div className="font-display text-[10px] font-bold tracking-[0.18em] uppercase text-text-dim px-[7px] pb-[6px] pt-4">Hors ligne — {offline.length}</div>
                {offline.map(f => <FriendRow key={f.id} friend={f} hasUnread={false} onOpenChat={openChat} onInviteToGame={inviteToGame} />)}
              </>
            )}
            {friends.length === 0 && (
              <div className="py-7 text-center text-sm text-text-dim">Aucun ami pour le moment</div>
            )}
          </>
        )}

        {tab === 'requests' && (
          requests.length === 0
            ? <div className="py-7 text-center text-sm text-text-dim">Aucune demande en attente</div>
            : <>
                <div className="font-display text-[10px] font-bold tracking-[0.18em] uppercase text-text-dim px-[7px] pb-[6px] pt-[14px]">Demandes reçues</div>
                {requests.map(r => (
                  <FriendRequestRow key={r.friendshipId} request={r} onAccept={acceptRequest} onDecline={declineRequest} />
                ))}
              </>
        )}
      </div>

      {activeChat && (
        <FriendChat
          chat={activeChat}
          myImageName={user?.imageName}
          onClose={closeChat}
          onSend={content => sendMessage(activeChat.userId, content)}
        />
      )}
    </div>
  )
}
