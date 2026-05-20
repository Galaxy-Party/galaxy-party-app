import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../hooks/useUserContext'
import RulesModal from '../components/RulesModal'

const INDIGO = '#818cf8'
const BORDER = 'rgba(129,140,248,0.22)'
const PANEL = 'rgba(12,8,28,0.82)'
const TEXT_DIM = 'rgba(241,240,255,0.35)'

const RULES_SEEN_KEY = 'galaxy-party:rules-seen'

export default function MenuPage() {
  const { user } = useUserContext()
  const navigate = useNavigate()
  const [showRules, setShowRules] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(RULES_SEEN_KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowRules(true)
    }
  }, [])

  const closeRules = () => {
    localStorage.setItem(RULES_SEEN_KEY, '1')
    setShowRules(false)
  }

  return (
    <>
      {showRules && <RulesModal onClose={closeRules} />}

      <div className="card-in" style={{ width: '100%', maxWidth: 1100, background: PANEL, backdropFilter: 'blur(28px)', border: `1px solid ${BORDER}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ padding: '20px 32px 16px', borderBottom: '1px solid rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 000 20M2 12h20"/>
              <path d="M12 2C6.5 12 6.5 12 12 22M12 2c5.5 10 5.5 10 0 20"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '0.02em', color: '#f1f0ff' }}>
            Bienvenue, {user?.username}
          </span>
        </div>

        <div style={{ padding: '48px 32px 52px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 52, letterSpacing: '-0.02em', background: 'linear-gradient(135deg,#818cf8,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, marginBottom: 12 }}>
              Galaxy Party
            </div>
            <p style={{ fontSize: 15, color: TEXT_DIM, fontFamily: "'DM Sans', sans-serif" }}>
              Choisissez une action dans la barre de navigation ci-dessous
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'Créer un salon', path: '/create-room' },
              { label: 'Rejoindre', path: '/rooms' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{ padding: '10px 24px', borderRadius: 41, background: 'rgba(79,70,229,0.15)', border: `1px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 12px rgba(129,140,248,0.15)' }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setShowRules(true)}
              style={{ padding: '10px 24px', borderRadius: 41, background: 'rgba(79,70,229,0.15)', border: `1px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 12px rgba(129,140,248,0.15)' }}
            >
              Règles
            </button>
          </div>
        </div>
      </div>
    </>
  )
}