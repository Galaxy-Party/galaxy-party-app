import sadEmoji from '../assets/sademoji.gif'

const ROSE = '#f472b6'
const BORDER = 'rgba(129,140,248,0.22)'

interface ReturnMenuModalProps {
  onClose: () => void
  onConfirm: () => void
}

export default function ReturnMenuModal({ onClose, onConfirm }: ReturnMenuModalProps) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="card-in" style={{ background: 'rgba(12,8,28,0.96)', border: `1px solid ${BORDER}`, borderRadius: 24, padding: '36px 40px', width: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
        <img src={sadEmoji} alt="sad" style={{ width: 56, height: 56 }} />

        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#f1f0ff', marginBottom: 8 }}>
            Vous quittez déjà le salon ?
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(241,240,255,0.35)', lineHeight: 1.7 }}>
            Ce salon sera supprimé et vous ne pourrez plus y accéder.
          </p>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <button
            onClick={onConfirm}
            style={{ width: '100%', height: 48, borderRadius: 41, background: 'rgba(244,114,182,0.1)', border: `1px solid ${ROSE}`, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Confirmer
          </button>
          <button
            onClick={onClose}
            style={{ width: '100%', height: 44, borderRadius: 41, background: 'transparent', border: '1px solid rgba(241,240,255,0.15)', color: 'rgba(241,240,255,0.35)', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}
