interface ModalButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'danger' | 'cancel'
}

function ModalButton({ onClick, children, variant = 'cancel' }: ModalButtonProps) {
  const styles = variant === 'danger'
    ? { backgroundColor: '#7f1d1d', border: '1px solid #ef4444', color: 'white' }
    : { backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)' }

  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl font-semibold cursor-pointer transition-opacity hover:opacity-80"
      style={styles}
    >
      {children}
    </button>
  )
}

export default ModalButton
