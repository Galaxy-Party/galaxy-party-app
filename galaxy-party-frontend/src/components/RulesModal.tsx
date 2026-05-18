const INDIGO = '#818cf8'
const ROSE = '#f472b6'
const BORDER = 'rgba(129,140,248,0.22)'

interface Props {
  onClose: () => void
}

export default function RulesModal({ onClose }: Props) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(7,5,15,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}
      onClick={onClose}
    >
      <div
        className="card-in"
        style={{ width: '100%', maxWidth: 640, background: 'rgba(12,8,28,0.96)', backdropFilter: 'blur(28px)', border: `1px solid ${BORDER}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '0.02em', color: '#f1f0ff' }}>
              Règles du jeu
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)', color: 'rgba(241,240,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 14, height: 14 }}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="scrollbar-indigo" style={{ padding: '24px 28px 28px', maxHeight: '70vh', overflowY: 'auto' }}>
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
            <div key={section.title} style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: ROSE, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                {section.title}
                <div style={{ flex: 1, height: 1, background: 'rgba(244,114,182,0.2)' }} />
              </div>
              {section.rules.map((rule, i) => (
                <p
                  key={i}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(241,240,255,0.72)', lineHeight: 1.75, padding: '10px 0', borderBottom: i < section.rules.length - 1 ? '1px solid rgba(129,140,248,0.07)' : 'none' }}
                  dangerouslySetInnerHTML={{ __html: rule.replace(/<b>/g, `<b style="color:${INDIGO};font-weight:600">`).replace(/<\/b>/g, '</b>') }}
                />
              ))}
            </div>
          ))}

          <button
            onClick={onClose}
            style={{ marginTop: 8, width: '100%', padding: '0 32px', height: 48, borderRadius: 41, background: 'rgba(79,70,229,0.15)', border: `1px solid ${INDIGO}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            C'est compris !
          </button>
        </div>
      </div>
    </div>
  )
}