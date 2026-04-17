import sadEmoji from '../assets/sademoji.gif'
import ModalButton from './ModalButton'

interface ReturnMenuModalProps {
  onClose: () => void
  onConfirm: () => void
}

function ReturnMenuModal({ onClose, onConfirm }: ReturnMenuModalProps) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
    >
      <div
        className="rounded-3xl border flex flex-col items-center gap-6 px-14 py-12"
        style={{
          backgroundColor: '#060f2e',
          borderColor: '#DEB992',
          width: '500px',
          boxShadow: '0 0 60px rgba(222,185,146,0.15)',
        }}
      >
        <img src={sadEmoji} alt="sad" className="w-16 h-16" />

        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-bold" style={{ color: '#DEB992' }}>
            Ooooh... Vous quittez déjà le salon ?
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Ce salon sera supprimé et vous ne pourrez plus y accéder.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <ModalButton variant="danger" onClick={onConfirm}>Confirmer</ModalButton>
          <ModalButton variant="cancel" onClick={onClose}>Annuler</ModalButton>
        </div>
      </div>
    </div>
  )
}

export default ReturnMenuModal
