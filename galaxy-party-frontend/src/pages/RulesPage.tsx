import { useNavigate, useLocation } from 'react-router-dom'
import backImg from '../assets/back.png'
import HomeButton from '../components/HomeButton'
import AvatarCircle from '../components/AvatarCircle'

function RulesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const avatarIndex: number = location.state?.avatarIndex ?? 0

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backImg})` }}
    >
      <HomeButton onClick={() => navigate('/menu', { state: { avatarIndex } })} />

      <div className="relative flex justify-center pt-10">
        <AvatarCircle avatarIndex={avatarIndex} className="" />
      </div>

      <div
        className="mx-auto mt-8 rounded-2xl border-2 p-10"
        style={{ backgroundColor: '#051240', borderColor: '#DEB992', width: '67%', minHeight: '300px' }}
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
