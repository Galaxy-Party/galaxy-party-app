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

const INPUT = 'w-full bg-[rgba(129,140,248,0.06)] border border-[rgba(129,140,248,0.22)] rounded-[14px] px-[18px] py-[14px] text-[#f1f0ff] text-[15px] font-medium outline-none box-border transition-[border-color,box-shadow] duration-200 focus:border-[#818cf8] focus:shadow-[0_0_0_3px_rgba(129,140,248,0.1)] placeholder:text-[rgba(241,240,255,0.35)]'
const INPUT_ERR = 'w-full bg-[rgba(129,140,248,0.06)] border border-[rgba(252,165,165,0.4)] rounded-[14px] px-[18px] py-[14px] text-[#f1f0ff] text-[15px] font-medium outline-none box-border transition-[border-color,box-shadow] duration-200 focus:border-[rgba(252,165,165,0.75)] focus:shadow-[0_0_0_3px_rgba(252,165,165,0.08)] placeholder:text-[rgba(241,240,255,0.35)]'
const LABEL = 'block font-display text-[11px] font-semibold tracking-[0.15em] uppercase text-[rgba(241,240,255,0.35)] mb-2'
const FIELD_ERR = 'text-[#fca5a5] text-xs mt-[6px]'

type RegFields = { username?: string; email?: string; password?: string }

function validateField(field: keyof RegFields, value: string): string | undefined {
  if (field === 'username') {
    if (!value.trim()) return 'Le pseudo est requis'
    if (value.trim().length < 3) return 'Minimum 3 caractères'
    if (value.trim().length > 32) return 'Maximum 32 caractères'
  }
  if (field === 'email') {
    if (!value.trim()) return "L'email est requis"
    if (!value.includes('@')) return 'Adresse email invalide'
  }
  if (field === 'password') {
    if (!value) return 'Le mot de passe est requis'
    if (value.length < 8) return 'Minimum 8 caractères'
  }
  return undefined
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
  const [fieldErrors, setFieldErrors] = useState<RegFields>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && user) navigate('/menu', { replace: true })
  }, [user, isLoading, navigate])

  const canLogin = emailOrUsername.trim().length > 0 && loginPassword.length > 0 && !submitting
  const canRegister = !Object.values(fieldErrors).some(Boolean) &&
    username.trim().length >= 3 && email.includes('@') && regPassword.length >= 8 && !submitting
  const canSubmit = tab === 'login' ? canLogin : canRegister

  const switchTab = (t: 'login' | 'register') => { setTab(t); setError(null); setFieldErrors({}) }

  const blurField = (field: keyof RegFields, value: string) =>
    setFieldErrors(prev => ({ ...prev, [field]: validateField(field, value) }))

  const clearFieldErr = (field: keyof RegFields) =>
    setFieldErrors(prev => ({ ...prev, [field]: undefined }))

  const handleLogin = async () => {
    if (!canLogin) return
    setSubmitting(true); setError(null)
    try {
      await login({ emailOrUsername: emailOrUsername.trim(), password: loginPassword }, avatars[avatarIndex])
      navigate('/menu', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError && err.status === 401 ? 'Identifiants incorrects' : 'Une erreur est survenue, réessayez')
    } finally { setSubmitting(false) }
  }

  const handleRegister = async () => {
    if (!canRegister) return
    setSubmitting(true); setError(null)
    try {
      await register({ username: username.trim(), email: email.trim(), password: regPassword, imageName: avatars[avatarIndex] })
      navigate('/menu', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        const msg = err.message.toLowerCase()
        if (msg.includes('email')) setFieldErrors(prev => ({ ...prev, email: 'Cet email est déjà utilisé' }))
        else if (msg.includes('username')) setFieldErrors(prev => ({ ...prev, username: "Ce nom d'utilisateur est déjà pris" }))
        else setError("Cet email ou ce nom d'utilisateur est déjà utilisé")
      } else if (err instanceof ApiError && err.status === 400) {
        setError('Les informations saisies sont invalides')
      } else {
        setError('Une erreur est survenue, réessayez')
      }
    } finally { setSubmitting(false) }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07050f] flex items-center justify-center">
      <Starfield />
      <Nebulae />

      <div className="fixed top-5 left-8 z-10">
        <img src={logo} alt="Galaxy Party" className="h-[120px] object-contain" />
      </div>

      <div className="card-in relative z-[1] w-full max-w-[520px] mx-6 bg-[rgba(12,8,28,0.9)] backdrop-blur-[28px] border border-[rgba(129,140,248,0.22)] rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
        <div className="px-12 pt-12 pb-11">

          {/* Tabs */}
          <div className="flex mb-8 border-b border-[rgba(129,140,248,0.22)]">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-[10px] bg-transparent font-display text-sm font-semibold tracking-[0.03em] border-b-2 -mb-px transition-all duration-200 ${tab === t ? 'text-[#818cf8] border-b-[#818cf8]' : 'text-[rgba(241,240,255,0.35)] border-b-transparent'}`}
              >
                {t === 'login' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          {/* Login fields */}
          {tab === 'login' && (
            <div className="fade-in">
              <div className="mb-[18px]">
                <label className={LABEL}>Nom d'utilisateur ou email</label>
                <input className={INPUT} type="text" value={emailOrUsername} autoFocus autoComplete="username"
                  placeholder="Votre pseudo…" onChange={e => setEmailOrUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
              <div className="mb-5">
                <label className={LABEL}>Mot de passe</label>
                <input className={INPUT} type="password" value={loginPassword} autoComplete="current-password"
                  placeholder="••••••••" onChange={e => setLoginPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
            </div>
          )}

          {/* Register fields */}
          {tab === 'register' && (
            <div className="fade-in">
              <div className="mb-[18px]">
                <label className={LABEL}>Nom d'utilisateur</label>
                <input
                  className={fieldErrors.username ? INPUT_ERR : INPUT}
                  type="text" value={username} autoFocus autoComplete="username"
                  placeholder="Galaxy"
                  onChange={e => { setUsername(e.target.value); clearFieldErr('username') }}
                  onBlur={e => blurField('username', e.target.value)}
                />
                {fieldErrors.username && <p className={FIELD_ERR}>{fieldErrors.username}</p>}
              </div>
              <div className="mb-[18px]">
                <label className={LABEL}>Email</label>
                <input
                  className={fieldErrors.email ? INPUT_ERR : INPUT}
                  type="email" value={email} autoComplete="email"
                  placeholder="alice@example.com"
                  onChange={e => { setEmail(e.target.value); clearFieldErr('email') }}
                  onBlur={e => blurField('email', e.target.value)}
                />
                {fieldErrors.email && <p className={FIELD_ERR}>{fieldErrors.email}</p>}
              </div>
              <div className="mb-5">
                <label className={LABEL}>Mot de passe</label>
                <input
                  className={fieldErrors.password ? INPUT_ERR : INPUT}
                  type="password" value={regPassword} autoComplete="new-password"
                  placeholder="••••••••"
                  onChange={e => { setRegPassword(e.target.value); clearFieldErr('password') }}
                  onBlur={e => blurField('password', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRegister()}
                />
                {fieldErrors.password && <p className={FIELD_ERR}>{fieldErrors.password}</p>}
              </div>
            </div>
          )}

          {/* Avatars */}
          <label className={LABEL}>Votre avatar</label>
          <div className="grid grid-cols-5 gap-2 mb-[22px]">
            {avatars.map((src, i) => (
              <div
                key={i}
                onClick={() => setAvatarIndex(i)}
                className={`aspect-square rounded-full border-2 bg-[#051240] flex items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden p-[6px] hover:border-[rgba(129,140,248,0.5)] ${i === avatarIndex ? 'border-[#818cf8] shadow-[0_0_12px_rgba(129,140,248,0.3)]' : 'border-[rgba(129,140,248,0.18)]'}`}
              >
                <img src={src} alt={`avatar-${i}`} className="w-4/5 h-4/5 object-contain" />
              </div>
            ))}
          </div>

          {error && <p className="text-[#fca5a5] text-sm mb-4 text-center">{error}</p>}

          <button
            disabled={!canSubmit}
            onClick={tab === 'login' ? handleLogin : handleRegister}
            className="w-full h-[54px] rounded-[14px] bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white font-display text-[15px] font-bold tracking-[0.04em] shadow-[0_4px_20px_rgba(79,70,229,0.4)] mt-2 transition-all duration-200 disabled:opacity-35 disabled:cursor-default"
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
