import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatars from '../assets/avatars'
import { useUserContext } from '../hooks/useUserContext'
import Starfield from '../components/Starfield'
import logo from '../assets/logo.png'

const INDIGO = '#818cf8'
const INDIGO_D = '#4f46e5'
const BORDER = 'rgba(129,140,248,0.22)'
const PANEL = 'rgba(12,8,28,0.82)'
const TEXT_DIM = 'rgba(241,240,255,0.35)'
const NAVY = '#051240'

function Nebulae() {
  return (
    <>
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 700, height: 500, background: '#4f46e5', opacity: 0.14, top: -180, left: -120, animation: 'nf 18s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 600, height: 450, background: '#db2777', opacity: 0.10, bottom: -120, right: -80, animation: 'nf 18s ease-in-out infinite alternate', animationDelay: '-7s' }} />
    </>
  )
}

export default function CreateUserPage() {
  const { user, isLoading, createUser } = useUserContext()
  const navigate = useNavigate()
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [username, setUsername] = useState('')
  const [imageName, setImageName] = useState<string>(avatars[0])

  useEffect(() => {
    if (!isLoading && user) navigate('/menu', { replace: true })
  }, [user, isLoading, navigate])

  useEffect(() => { setImageName(avatars[avatarIndex]) }, [avatarIndex])

  const handleSubmit = () => {
    if (!username.trim()) return
    createUser({ username, imageName })
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#07050f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <Starfield />
      <Nebulae />

      <div style={{ position: 'fixed', top: 20, left: 32, zIndex: 10 }}>
        <img src={logo} alt="Galaxy Party" style={{ height: 120, objectFit: 'contain' }} />
      </div>

      <div className="card-in" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 580, background: PANEL, backdropFilter: 'blur(28px)', border: `1px solid ${BORDER}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', margin: '0 24px' }}>
        <div style={{ padding: '36px 40px 40px' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 26, color: '#f1f0ff', marginBottom: 4, textAlign: 'center' }}>
            Bienvenue !
          </div>
          <div style={{ fontSize: 14, color: TEXT_DIM, textAlign: 'center', marginBottom: 32 }}>
            Choisissez votre nom et votre avatar pour commencer
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: INDIGO, marginBottom: 10, display: 'block' }}>
              Votre nom
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Entrez votre nom…"
              style={{ width: '100%', background: 'rgba(129,140,248,0.06)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 20px', color: '#f1f0ff', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
              autoComplete="off"
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: INDIGO, marginBottom: 10, display: 'block' }}>
              Votre avatar
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {avatars.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setAvatarIndex(i)}
                  style={{ aspectRatio: '1', borderRadius: '50%', border: `2px solid ${i === avatarIndex ? INDIGO : 'rgba(129,140,248,0.2)'}`, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', overflow: 'hidden', padding: 8, boxShadow: i === avatarIndex ? '0 0 16px rgba(129,140,248,0.25)' : 'none' }}
                >
                  <img src={src} alt={`avatar-${i}`} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={!username.trim()}
            onClick={handleSubmit}
            style={{ width: '100%', height: 56, borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${INDIGO_D},#7c3aed)`, color: 'white', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', cursor: username.trim() ? 'pointer' : 'default', boxShadow: '0 4px 20px rgba(79,70,229,0.4)', transition: 'all 0.2s', opacity: username.trim() ? 1 : 0.35, marginTop: 28 }}
          >
            Commencer l'aventure
          </button>
        </div>
      </div>
    </div>
  )
}
