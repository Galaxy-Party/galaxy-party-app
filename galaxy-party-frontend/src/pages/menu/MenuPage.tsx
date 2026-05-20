import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../hooks/useUserContext'
import RulesModal from '../../components/RulesModal'
import CardHeader from '../../components/CardHeader'
import MenuButton from './components/MenuButton'

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

      <div className="card-in w-full max-w-[1100px] bg-panel/82 backdrop-blur-[28px] border border-border rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
        <CardHeader
          title={`Bienvenue, ${user?.username ?? ''}`}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 000 20M2 12h20"/>
              <path d="M12 2C6.5 12 6.5 12 12 22M12 2c5.5 10 5.5 10 0 20"/>
            </svg>
          }
        />

        <div className="px-8 pt-12 pb-13 flex flex-col items-center gap-8">
          <div className="text-center">
            <div className="font-display font-bold text-[52px] tracking-[-0.02em] bg-gradient-to-br from-indigo to-rose bg-clip-text text-transparent leading-[1.1] mb-3">
              Galaxy Party
            </div>
            <p className="text-[15px] text-text-dim">
              Choisissez une action dans la barre de navigation ci-dessous
            </p>
          </div>

          <div className="flex gap-4">
            <MenuButton label="Créer un salon" onClick={() => navigate('/create-room')} />
            <MenuButton label="Rejoindre" onClick={() => navigate('/rooms')} />
            <MenuButton label="Règles" onClick={() => setShowRules(true)} />
          </div>
        </div>
      </div>
    </>
  )
}
