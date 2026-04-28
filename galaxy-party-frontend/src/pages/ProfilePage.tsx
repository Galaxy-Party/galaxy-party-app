import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatars from '../assets/avatars'
import { useUserContext } from '../hooks/useUserContext'

const INDIGO = '#818cf8'
const INDIGO_D = '#4f46e5'
const BORDER = 'rgba(129,140,248,0.22)'
const PANEL = 'rgba(12,8,28,0.82)'
const NAVY = '#051240'

export default function ProfilePage() {
  const { user, updateProfile, logout } = useUserContext()
  const navigate = useNavigate()
  const [username, setUsername] = useState(user?.username ?? '')
  const [avatarIndex, setAvatarIndex] = useState(() =>
    Math.max(0, avatars.findIndex(a => a === user?.imageName))
  )
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setUsername(user.username)
    const idx = avatars.findIndex(a => a === user.imageName)
    if (idx >= 0) setAvatarIndex(idx)
  }, [user])

  const handleSave = async () => {
    if (!username.trim()) return
    setSaving(true)
    setFeedback(null)
    try {
      await updateProfile({ username: username.trim(), imageName: avatars[avatarIndex] })
      setFeedback('Profil mis à jour')
    } catch {
      setFeedback('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="card-in" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 580, background: PANEL, backdropFilter: 'blur(28px)', border: `1px solid ${BORDER}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', margin: '0 auto' }}>
      <div style={{ padding: '36px 40px 40px' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 26, color: '#f1f0ff', marginBottom: 24, textAlign: 'center' }}>
          Mon profil
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: INDIGO, marginBottom: 10, display: 'block' }}>
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', background: 'rgba(129,140,248,0.06)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 20px', color: '#f1f0ff', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: INDIGO, marginBottom: 10, display: 'block' }}>
            Avatar
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

        {feedback && (
          <div style={{ color: feedback.startsWith('Erreur') ? '#fca5a5' : '#86efac', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>{feedback}</div>
        )}

        <button
          disabled={saving || !username.trim()}
          onClick={handleSave}
          style={{ width: '100%', height: 56, borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${INDIGO_D},#7c3aed)`, color: 'white', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', cursor: saving ? 'default' : 'pointer', boxShadow: '0 4px 20px rgba(79,70,229,0.4)', transition: 'all 0.2s', opacity: saving || !username.trim() ? 0.35 : 1, marginBottom: 12 }}
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>

        <button
          onClick={handleLogout}
          style={{ width: '100%', height: 48, borderRadius: 14, border: `1px solid ${BORDER}`, background: 'transparent', color: '#fca5a5', fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}