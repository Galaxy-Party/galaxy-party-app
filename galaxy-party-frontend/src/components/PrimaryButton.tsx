interface PrimaryButtonProps {
  onClick?: () => void
  children: React.ReactNode
  width?: string
  height?: string
}

function PrimaryButton({ onClick, children, width = '340px', height = '75px' }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-white text-2xl cursor-pointer border-2 rounded-[41px] tracking-wide transition-opacity hover:opacity-70"
      style={{ backgroundColor: '#051240', borderColor: '#DEB992', width, height }}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
