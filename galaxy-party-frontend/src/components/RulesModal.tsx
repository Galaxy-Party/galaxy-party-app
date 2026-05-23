interface Props {
  onClose: () => void
}

export default function RulesModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-bg/85 flex items-center justify-center px-4 py-6"
      onClick={onClose}
    >
      <div
        className="card-in w-full max-w-[640px] bg-panel/96 backdrop-blur-[28px] border border-border rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-7 pt-5 pb-4 border-b border-indigo/12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-indigo/10 border border-indigo/25 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-indigo)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>
              </svg>
            </div>
            <span className="font-display font-bold text-[17px] tracking-[0.02em] text-text">
              Règles du jeu
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-indigo/8 border border-indigo/20 text-text/50 flex items-center justify-center shrink-0 transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="scrollbar-indigo px-7 pt-6 pb-7 max-h-[70vh] overflow-y-auto">
          {[
            {
              title: 'Principe',
              rules: ['Le jeu oppose <b>2 candidats</b>. Chacun démarre avec un capital de <b>2 minutes 30</b> au compteur.'],
            },
            {
              title: 'Déroulement',
              rules: [
                'Les questions sont posées en alternance. C\'est toujours <b>le même joueur qui répond</b> jusqu\'à ce qu\'il réponde correctement.',
                '<b>Bonne réponse :</b> le joueur conserve son temps et passe la main à son adversaire.',
                '<b>Mauvaise réponse ou silence :</b> le joueur ne passe pas la main — son <b>chronomètre continue</b> de s\'écouler jusqu\'à ce qu\'il réponde correctement.',
              ],
            },
            {
              title: 'Objectif & Victoire',
              rules: [
                'Faire tomber le <b>chronomètre adverse à zéro</b> en répondant juste le plus souvent possible.',
                'Le joueur dont le temps atteint zéro est <b>éliminé</b>. Son adversaire remporte la partie !',
              ],
            },
          ].map((section) => (
            <div key={section.title} className="mb-[22px]">
              <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-rose mb-3.5 flex items-center gap-2.5">
                {section.title}
                <div className="flex-1 h-px bg-rose/20" />
              </div>
              {section.rules.map((rule, i) => (
                <p
                  key={i}
                  className={`text-[15px] text-text/72 leading-[1.75] py-2.5 ${i < section.rules.length - 1 ? 'border-b border-indigo/7' : ''}`}
                  dangerouslySetInnerHTML={{ __html: rule.replace(/<b>/g, '<b style="color:var(--color-indigo);font-weight:600">').replace(/<\/b>/g, '</b>') }}
                />
              ))}
            </div>
          ))}

          <button
            onClick={onClose}
            className="mt-2 w-full px-8 h-12 rounded-[41px] bg-indigo-deep/15 border border-indigo text-text font-display text-[14px] font-semibold transition-all duration-200"
          >
            C'est compris !
          </button>
        </div>
      </div>
    </div>
  )
}
