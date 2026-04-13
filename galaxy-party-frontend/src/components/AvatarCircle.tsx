import avatars from '../assets/avatars'

interface AvatarCircleProps {
  avatarIndex: number
  className?: string
}

function AvatarCircle({ avatarIndex, className = 'mt-28' }: AvatarCircleProps) {
  return (
    <div
      className={`${className} w-72 h-72 rounded-full overflow-hidden border-2 flex items-center justify-center`}
      style={{ backgroundColor: '#051240', borderColor: '#DEB992' }}
    >
      <img src={avatars[avatarIndex]} alt="avatar" className="w-3/4 h-3/4 object-contain" />
    </div>
  )
}

export default AvatarCircle
