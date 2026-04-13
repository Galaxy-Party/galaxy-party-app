import { useNavigate, useLocation } from 'react-router-dom'
import backImg from '../assets/back.png'
import avatars from '../assets/avatars'

function RulesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const avatarIndex: number = location.state?.avatarIndex ?? 0

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backImg})` }}
    >
      <div className="relative flex justify-center pt-10">
        <button
          onClick={() => navigate('/menu', { state: { avatarIndex } })}
          className="absolute left-6 top-8 cursor-pointer"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L2 10H5V20H10V14H14V20H19V10H22L12 3Z" stroke="#DEB992" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            <circle cx="12" cy="10" r="1.5" fill="#DEB992"/>
          </svg>
        </button>

        <div
          className="w-72 h-72 rounded-full overflow-hidden border-2 flex items-center justify-center"
          style={{ backgroundColor: '#051240', borderColor: '#DEB992' }}
        >
          <img src={avatars[avatarIndex]} alt="avatar" className="w-3/4 h-3/4 object-contain" />
        </div>
      </div>

      <div
        className="mx-auto mt-8 rounded-2xl border-2 p-10"
        style={{
          backgroundColor: '#051240',
          borderColor: '#DEB992',
          width: '67%',
          minHeight: '300px',
        }}
      >
        <h1 className="text-center text-5xl mb-8" style={{ color: '#4E8098' }}>
          Règles du jeu
        </h1>
        <div className="text-white text-lg leading-relaxed flex flex-col gap-5">
          <p>
            <span style={{ color: '#DEB992' }} className="font-semibold">Principe :</span> Le jeu oppose <span style={{ color: '#DEB992' }}>2 candidats</span>. Chacun démarre avec un capital de <span style={{ color: '#DEB992' }}>2 minutes 30</span> au compteur.
          </p>
          <p>
            <span style={{ color: '#DEB992' }} className="font-semibold">Déroulement :</span> Les questions sont posées en alternance. C'est toujours le même joueur qui répond jusqu'à ce qu'il réponde correctement.
          </p>
          <p>
            <span style={{ color: '#DEB992' }} className="font-semibold">Bonne réponse :</span> Le joueur conserve son temps et passe la main à son adversaire.
          </p>
          <p>
            <span style={{ color: '#DEB992' }} className="font-semibold">Mauvaise réponse ou silence :</span> Le joueur ne passe pas la main — son chronomètre continue de s'écouler jusqu'à ce qu'il réponde correctement.
          </p>
          <p>
            <span style={{ color: '#DEB992' }} className="font-semibold">Objectif :</span> Faire tomber le chronomètre adverse à zéro en répondant juste le plus souvent possible.
          </p>
          <p>
            <span style={{ color: '#DEB992' }} className="font-semibold">Victoire :</span> Le joueur dont le temps atteint zéro est éliminé. Son adversaire remporte la partie !
          </p>
        </div>
      </div>
    </div>
  )
}

export default RulesPage
