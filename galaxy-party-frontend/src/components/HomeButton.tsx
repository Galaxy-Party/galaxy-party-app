interface HomeButtonProps {
  onClick: () => void
}

function HomeButton({ onClick }: HomeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute left-6 top-8 cursor-pointer transition-opacity hover:opacity-70 z-10"
      style={{ background: 'none', border: 'none', padding: 0 }}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L2 10H5V20H10V14H14V20H19V10H22L12 3Z" stroke="#DEB992" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
        <circle cx="12" cy="10" r="1.5" fill="#DEB992"/>
      </svg>
    </button>
  )
}

export default HomeButton
