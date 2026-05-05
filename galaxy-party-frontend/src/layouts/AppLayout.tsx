import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useUserContext } from '../hooks/useUserContext'
import Starfield from '../components/Starfield'
import FriendsPanel from '../components/FriendsPanel'
import GameInviteNotif from '../components/GameInviteNotif'
import logo from '../assets/logo.png'
import socket from '../socket/client'

function Nebulae() {
  return (
    <>
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 700, height: 500, background: '#4f46e5', opacity: 0.14, top: -180, left: -120, animation: 'nf 18s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 600, height: 450, background: '#db2777', opacity: 0.10, bottom: -120, right: -80, animation: 'nf 18s ease-in-out infinite alternate', animationDelay: '-7s' }} />
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 450, height: 350, background: '#0d9488', opacity: 0.08, top: '30%', left: '38%', animation: 'nf 18s ease-in-out infinite alternate', animationDelay: '-13s' }} />
    </>
  )
}

const dockItems = [
  {
    path: '/create-room',
    label: 'Créer un salon',
    sub: 'Nouvelle partie',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  },
  {
    path: '/rooms',
    label: 'Rejoindre',
    sub: 'Salons ouverts',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>,
  },
  {
    path: '/ranked',
    label: 'Classé',
    sub: 'Mode ranked',
    ranked: true,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  },
  {
    path: '/rules',
    label: 'Règles du jeu',
    sub: 'Comment jouer ?',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>,
  },
]

export default function AppLayout() {
  const { user, logout, updateElo } = useUserContext()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [friendsOpen, setFriendsOpen] = useState(false)
  const [hasNotif, setHasNotif] = useState(false)
  const [gameInvite, setGameInvite] = useState<{ inviteId: string; fromUserId: string; fromUsername: string; fromImageName: string | null } | null>(null)

  useEffect(() => {
    const onList = ({ requests }: { requests: unknown[] }) => {
      if (!friendsOpen) setHasNotif(requests.length > 0)
    }
    const onRequested = () => { if (!friendsOpen) setHasNotif(true) }
    const onMessage  = () => { if (!friendsOpen) setHasNotif(true) }

    const onInvite = (invite: { inviteId: string; fromUserId: string; fromUsername: string; fromImageName: string | null }) => {
      setGameInvite(invite)
    }
    const onInviteAccepted = (roomId: string) => {
      setGameInvite(null)
      navigate(`/rooms/${roomId}`)
    }
    const onEloUpdated = (newElo: number) => updateElo(newElo)

    socket.on('friend:list', onList)
    socket.on('friend:requested', onRequested)
    socket.on('message:received', onMessage)
    socket.on('friend:game_invite', onInvite)
    socket.on('friend:invite_accepted', onInviteAccepted)
    socket.on('ranked:elo_updated', onEloUpdated)
    return () => {
      socket.off('friend:list', onList)
      socket.off('friend:requested', onRequested)
      socket.off('message:received', onMessage)
      socket.off('friend:game_invite', onInvite)
      socket.off('friend:invite_accepted', onInviteAccepted)
      socket.off('ranked:elo_updated', onEloUpdated)
    }
  }, [friendsOpen, navigate])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07050f]">
      <FriendsPanel open={friendsOpen} onClose={() => setFriendsOpen(false)} />
      {friendsOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setFriendsOpen(false)} />
      )}
      {gameInvite && (
        <GameInviteNotif
          invite={gameInvite}
          onAccept={(roomId) => { setGameInvite(null); navigate(`/rooms/${roomId}`) }}
          onDecline={() => setGameInvite(null)}
        />
      )}
      <Starfield />
      <Nebulae />

      <div className="relative z-[1] w-full h-full flex flex-col">

        {/* Header */}
        <header className="w-full flex items-center justify-between px-8 pt-5 shrink-0">
          <button onClick={() => navigate('/menu')} className="bg-transparent border-none p-0 cursor-pointer">
            <img src={logo} alt="Galaxy Party" className="h-[120px] object-contain" />
          </button>

          {user && (
            <div className="flex items-center gap-[10px]">
              {/* Friends button */}
              <button
                onClick={() => { setFriendsOpen(o => !o); setHasNotif(false) }}
                className={`relative flex items-center gap-2 backdrop-blur-[14px] rounded-[30px] py-[7px] pr-4 pl-3 transition-all duration-200 ${friendsOpen ? 'bg-[rgba(129,140,248,0.15)] border border-[#818cf8]' : 'bg-[rgba(12,8,28,0.92)] border border-[rgba(129,140,248,0.45)]'}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke={friendsOpen ? '#818cf8' : 'rgba(241,240,255,0.85)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
                  <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.85"/>
                </svg>
                <span className={`font-display text-[13px] font-semibold ${friendsOpen ? 'text-[#818cf8]' : 'text-[#f1f0ff]'}`}>Amis</span>
                {hasNotif && <span className="absolute top-[6px] right-[8px] w-2 h-2 rounded-full bg-[#f472b6] shadow-[0_0_6px_#f472b6]" />}
              </button>

              {/* Player tag */}
              <div className="flex items-center gap-[9px] bg-[rgba(12,8,28,0.92)] backdrop-blur-[14px] border border-[rgba(129,140,248,0.45)] rounded-[30px] py-[7px] pr-4 pl-[10px]">
                <div className="w-7 h-7 rounded-full bg-[#051240] border border-[#818cf8] overflow-hidden flex items-center justify-center shrink-0">
                  <img src={user.imageName ?? undefined} alt="avatar" className="w-[80%] h-[80%] object-contain" />
                </div>
                <span className="font-display text-[13px] font-semibold text-[#f1f0ff]">{user.username}</span>
                <div className="w-[7px] h-[7px] rounded-full bg-[#34d399] shadow-[0_0_6px_#34d399] shrink-0" />
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 w-full flex items-center justify-center px-8 py-[14px] overflow-hidden">
          <Outlet />
        </div>

        {/* Dock */}
        <div className="shrink-0 flex justify-center px-8 pb-6 pt-[10px] w-full">
          <div className="flex gap-[6px] bg-[rgba(12,8,28,0.95)] backdrop-blur-[24px] border border-[rgba(129,140,248,0.4)] rounded-[20px] p-[7px] shadow-[0_8px_40px_rgba(0,0,0,0.7)] w-[min(940px,92vw)]">

            {dockItems.map(item => {
              const active = pathname === item.path
              const isRanked = 'ranked' in item && item.ranked
              const activeColor = isRanked ? '#fbbf24' : '#818cf8'
              const activeBg = isRanked ? 'rgba(251,191,36,0.12)' : 'rgba(129,140,248,0.12)'
              const activeShadow = isRanked ? '0 0 16px rgba(251,191,36,0.15)' : '0 0 16px rgba(129,140,248,0.12)'
              const activeSubColor = isRanked ? 'rgba(251,191,36,0.5)' : 'rgba(129,140,248,0.5)'
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-[2px] py-[10px] px-4 flex-1 rounded-[14px] border transition-all duration-200 ${active ? 'border-transparent' : 'border-transparent bg-transparent'}`}
                  style={active ? { background: activeBg, borderColor: activeColor, boxShadow: activeShadow } : {}}
                >
                  <div style={{ opacity: active ? 1 : 0.7, color: active ? activeColor : 'rgba(241,240,255,0.75)' }}>{item.icon}</div>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-center transition-colors duration-200" style={{ color: active ? activeColor : 'rgba(241,240,255,0.75)' }}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-center transition-colors duration-200" style={{ color: active ? activeSubColor : 'rgba(241,240,255,0.4)' }}>
                    {item.sub}
                  </span>
                </button>
              )
            })}

            <div className="w-px bg-[rgba(129,140,248,0.3)] my-1 self-stretch shrink-0" />

            <button
              onClick={logout}
              className="flex flex-col items-center gap-[2px] py-[10px] px-4 flex-1 rounded-[14px] border border-transparent bg-transparent transition-all duration-200"
            >
              <div className="opacity-80 text-[#f472b6]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-center text-[#f472b6] opacity-90">Déconnexion</span>
              <span className="text-[10px] text-center text-[rgba(244,114,182,0.55)]">Quitter</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
