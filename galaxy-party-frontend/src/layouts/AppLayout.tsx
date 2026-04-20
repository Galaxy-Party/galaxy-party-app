import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useUserContext } from '../hooks/useUserContext'
import Starfield from '../components/Starfield'

const INDIGO = '#818cf8'
const ROSE = '#f472b6'
const BORDER = 'rgba(129,140,248,0.22)'
const TEXT_DIM = 'rgba(241,240,255,0.35)'
const NAVY = '#051240'

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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    path: '/rooms',
    label: 'Rejoindre',
    sub: 'Salons ouverts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
      </svg>
    ),
  },
  {
    path: '/rules',
    label: 'Règles du jeu',
    sub: 'Comment jouer ?',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>
      </svg>
    ),
  },
]

export default function AppLayout() {
  const { user, logout } = useUserContext()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#07050f', fontFamily: "'DM Sans', sans-serif" }}>
      <Starfield />
      <Nebulae />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px 0', flexShrink: 0 }}>
          <button
            onClick={() => navigate('/menu')}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'linear-gradient(90deg,#818cf8,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Galaxy Party
            </span>
          </button>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(12,8,28,0.6)', backdropFilter: 'blur(14px)', border: `1px solid ${BORDER}`, borderRadius: 30, padding: '7px 16px 7px 10px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: NAVY, border: `1px solid ${INDIGO}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={user.imageName ?? undefined} alt="avatar" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: '#f1f0ff' }}>{user.username}</span>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399', flexShrink: 0 }} />
            </div>
          )}
        </header>

        {/* Content area */}
        <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 32px 4px', overflow: 'hidden' }}>
          <Outlet />
        </div>

        {/* Dock */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', padding: '10px 32px 24px', width: '100%' }}>
          <div style={{ display: 'flex', gap: 6, background: 'rgba(12,8,28,0.8)', backdropFilter: 'blur(24px)', border: `1px solid ${BORDER}`, borderRadius: 20, padding: 7, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', width: 'min(940px, 92vw)' }}>
            {dockItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    padding: '10px 16px', flex: 1, borderRadius: 14,
                    border: `1px solid ${isActive ? INDIGO : 'transparent'}`,
                    background: isActive ? 'rgba(129,140,248,0.12)' : 'transparent',
                    boxShadow: isActive ? '0 0 16px rgba(129,140,248,0.12)' : 'none',
                    transition: 'all 0.2s ease',
                    color: isActive ? INDIGO : TEXT_DIM,
                  }}
                >
                  <div style={{ opacity: isActive ? 1 : 0.4 }}>{item.icon}</div>
                  <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: isActive ? INDIGO : TEXT_DIM, transition: 'color 0.2s', textAlign: 'center' }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: 10, color: isActive ? 'rgba(129,140,248,0.5)' : 'rgba(241,240,255,0.2)', textAlign: 'center' }}>
                    {item.sub}
                  </span>
                </button>
              )
            })}
            <div style={{ width: 1, background: 'rgba(129,140,248,0.15)', margin: '4px 0', alignSelf: 'stretch', flexShrink: 0 }} />
            <button
              onClick={logout}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '10px 16px', flex: 1, borderRadius: 14,
                border: '1px solid transparent',
                background: 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ opacity: 0.5, color: ROSE }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: ROSE, opacity: 0.7, textAlign: 'center' }}>
                Déconnexion
              </span>
              <span style={{ fontSize: 10, color: 'rgba(244,114,182,0.3)', textAlign: 'center' }}>Quitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
