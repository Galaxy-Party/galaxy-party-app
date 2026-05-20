import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatars from '../../assets/avatars'
import { useUserContext } from '../../hooks/useUserContext'
import Starfield from '../../components/Starfield'
import Nebulae from '../../components/Nebulae'
import logo from '../../assets/logo.png'
import { ApiError } from '../../api/client'
import { validateField, type RegFields } from './validation'
import TextField from './components/TextField'
import AvatarGrid from './components/AvatarGrid'

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
      await login({ emailOrUsername: emailOrUsername.trim(), password: loginPassword })
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
    <div className="relative w-screen h-screen overflow-hidden bg-bg flex items-center justify-center">
      <Starfield />
      <Nebulae />

      <div className="fixed top-5 left-8 z-10">
        <img src={logo} alt="Galaxy Party" className="h-[120px] object-contain" />
      </div>

      <div className="card-in relative z-[1] w-full max-w-[520px] mx-6 bg-panel/90 backdrop-blur-[28px] border border-border rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
        <div className="px-12 pt-12 pb-11">

          {/* Tabs */}
          <div className="flex mb-8 border-b border-border">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-[10px] bg-transparent font-display text-sm font-semibold tracking-[0.03em] border-b-2 -mb-px transition-all duration-200 ${tab === t ? 'text-indigo border-b-indigo' : 'text-text-dim border-b-transparent'}`}
              >
                {t === 'login' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          {/* Login fields */}
          {tab === 'login' && (
            <div className="fade-in">
              <div className="mb-[18px]">
                <TextField label="Nom d'utilisateur ou email" type="text" value={emailOrUsername} onChange={setEmailOrUsername} placeholder="Votre pseudo…" autoFocus autoComplete="username" onSubmit={handleLogin} />
              </div>
              <div className="mb-5">
                <TextField label="Mot de passe" type="password" value={loginPassword} onChange={setLoginPassword} placeholder="••••••••" autoComplete="current-password" onSubmit={handleLogin} />
              </div>
            </div>
          )}

          {/* Register fields */}
          {tab === 'register' && (
            <div className="fade-in">
              <div className="mb-[18px]">
                <TextField label="Nom d'utilisateur" type="text" value={username} onChange={v => { setUsername(v); clearFieldErr('username') }} placeholder="Galaxy" autoFocus autoComplete="username" error={fieldErrors.username} onBlur={() => blurField('username', username)} />
              </div>
              <div className="mb-[18px]">
                <TextField label="Email" type="email" value={email} onChange={v => { setEmail(v); clearFieldErr('email') }} placeholder="alice@example.com" autoComplete="email" error={fieldErrors.email} onBlur={() => blurField('email', email)} />
              </div>
              <div className="mb-5">
                <TextField label="Mot de passe" type="password" value={regPassword} onChange={v => { setRegPassword(v); clearFieldErr('password') }} placeholder="••••••••" autoComplete="new-password" error={fieldErrors.password} onBlur={() => blurField('password', regPassword)} onSubmit={handleRegister} />
              </div>
              <div className="mb-[22px]">
                <label className="block font-display text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim mb-2">Votre avatar</label>
                <AvatarGrid selected={avatarIndex} onSelect={setAvatarIndex} />
              </div>
            </div>
          )}

          {error && <p className="text-danger text-sm mb-4 text-center">{error}</p>}

          <button
            disabled={!canSubmit}
            onClick={tab === 'login' ? handleLogin : handleRegister}
            className="w-full h-[54px] rounded-[14px] bg-gradient-to-br from-indigo-deep to-purple text-white font-display text-[15px] font-bold tracking-[0.04em] shadow-[0_4px_20px_rgba(79,70,229,0.4)] mt-2 transition-all duration-200 disabled:opacity-35 disabled:cursor-default"
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
