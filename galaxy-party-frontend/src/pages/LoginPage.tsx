import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatars from '../assets/avatars'
import { useUserContext } from '../hooks/useUserContext'
import Starfield from '../components/Starfield'
import logo from '../assets/logo.png'
import { ApiError } from '../api/client'

function Nebulae() {
  return (
    <>
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 700, height: 500, background: '#4f46e5', opacity: 0.14, top: -180, left: -120, animation: 'nf 18s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, filter: 'blur(90px)', width: 600, height: 450, background: '#db2777', opacity: 0.10, bottom: -120, right: -80, animation: 'nf 18s ease-in-out infinite alternate', animationDelay: '-7s' }} />
    </>
  )
}

export default function LoginPage() {
  const { user, isLoading, login, register } = useUserContext()
  const navigate = useNavigate()

  const [tab, setTab] = useState<'login' | 'register'>('login')

  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const [avatarIndex, setAvatarIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && user) navigate('/menu', { replace: true })
  }, [user, isLoading, navigate])

  const canLogin = emailOrUsername.trim().length > 0 && loginPassword.length > 0 && !submitting
  const canRegister = username.trim().length >= 3 && email.includes('@') && regPassword.length >= 8 && !submitting
  const canSubmit = tab === 'login' ? canLogin : canRegister

  const switchTab = (t: 'login' | 'register') => { setTab(t); setError(null) }

  const handleLogin = async () => {
    if (!canLogin) return
    setSubmitting(true); setError(null)
    try {
      await login({ emailOrUsername: emailOrUsername.trim(), password: loginPassword }, avatars[avatarIndex])
      navigate('/menu', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError && err.status === 401 ? 'Identifiants invalides' : 'Une erreur est survenue, réessayez')
    } finally { setSubmitting(false) }
  }

  const handleRegister = async () => {
    if (!canRegister) return
    setSubmitting(true); setError(null)
    try {
      await register({ username: username.trim(), email: email.trim(), password: regPassword, imageName: avatars[avatarIndex] })
      navigate('/menu', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) setError("Cet email ou ce nom d'utilisateur est déjà utilisé")
      else if (err instanceof ApiError && err.status === 400) setError('Les informations saisies sont invalides')
      else setError('Une erreur est survenue, réessayez')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="auth-page">
      <Starfield />
      <Nebulae />

      <div className="auth-logo">
        <img src={logo} alt="Galaxy Party" style={{ height: 120, objectFit: 'contain' }} />
      </div>

      <div className="auth-card card-in">
        <div className="auth-body">

          <div className="auth-tabs">
            {(['login', 'register'] as const).map(t => (
              <button key={t} className={`auth-tab${tab === t ? ' active' : ''}`} onClick={() => switchTab(t)}>
                {t === 'login' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          {tab === 'login' && (
            <div className="fade-in">
              <div className="auth-field">
                <label className="auth-label">Nom d'utilisateur ou email</label>
                <input className="auth-input" type="text" value={emailOrUsername} autoFocus autoComplete="username"
                  placeholder="Votre pseudo…" onChange={e => setEmailOrUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
              <div className="auth-field">
                <label className="auth-label">Mot de passe</label>
                <input className="auth-input" type="password" value={loginPassword} autoComplete="current-password"
                  placeholder="••••••••" onChange={e => setLoginPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div className="fade-in">
              <div className="auth-field">
                <label className="auth-label">Nom d'utilisateur</label>
                <input className="auth-input" type="text" value={username} autoFocus autoComplete="username"
                  placeholder="Galaxy" onChange={e => setUsername(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input className="auth-input" type="email" value={email} autoComplete="email"
                  placeholder="alice@example.com" onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label">Mot de passe (min. 8 caractères)</label>
                <input className="auth-input" type="password" value={regPassword} autoComplete="new-password"
                  placeholder="••••••••" onChange={e => setRegPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRegister()} />
              </div>
            </div>
          )}

          <label className="auth-label">Votre avatar</label>
          <div className="auth-avatar-grid">
            {avatars.map((src, i) => (
              <div key={i} className={`auth-avatar-cell${i === avatarIndex ? ' selected' : ''}`} onClick={() => setAvatarIndex(i)}>
                <img src={src} alt={`avatar-${i}`} />
              </div>
            ))}
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            className="auth-submit"
            disabled={!canSubmit}
            onClick={tab === 'login' ? handleLogin : handleRegister}
          >
            {submitting
              ? (tab === 'login' ? 'Connexion…' : 'Création…')
              : (tab === 'login' ? 'Se connecter' : 'Créer mon compte')}
          </button>
        </div>
      </div>
    </div>
  )
}
