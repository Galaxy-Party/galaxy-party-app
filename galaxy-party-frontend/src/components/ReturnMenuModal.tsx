import sadEmoji from '../assets/sademoji.gif'

interface ReturnMenuModalProps {
  onClose: () => void
  onConfirm: () => void
}

export default function ReturnMenuModal({ onClose, onConfirm }: ReturnMenuModalProps) {
  return (
    <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-[4px] flex items-center justify-center">
      <div className="card-in bg-panel/96 border border-border rounded-[24px] px-10 py-9 w-[420px] shadow-[0_24px_60px_rgba(0,0,0,0.7)] flex flex-col items-center gap-4 text-center">
        <img src={sadEmoji} alt="sad" className="w-14 h-14" />

        <div>
          <div className="font-display font-bold text-[18px] text-text mb-2">
            Vous quittez déjà le salon ?
          </div>
          <p className="text-[13px] text-text-dim leading-[1.7]">
            Ce salon sera supprimé et vous ne pourrez plus y accéder.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2.5 mt-2">
          <button
            onClick={onConfirm}
            className="w-full h-12 rounded-[41px] bg-rose/10 border border-rose text-text font-display text-[14px] font-semibold transition-all duration-200"
          >
            Confirmer
          </button>
          <button
            onClick={onClose}
            className="w-full h-11 rounded-[41px] bg-transparent border border-text/15 text-text-dim text-[14px] font-medium transition-all duration-200"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}
