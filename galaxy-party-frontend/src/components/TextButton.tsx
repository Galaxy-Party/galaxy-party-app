interface TextButtonProps {
  onClick?: () => void
  children: React.ReactNode
  size?: string
  color?: string
}

function TextButton({ onClick, children, size = 'text-2xl', color = '#4E8098' }: TextButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${size} font-bold cursor-pointer transition-opacity hover:opacity-60`}
      style={{ color, background: 'none', border: 'none' }}
    >
      {children}
    </button>
  )
}

export default TextButton
