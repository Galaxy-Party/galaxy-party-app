interface AvatarCircleProps {
  avatarFile: string | null | undefined
  className?: string
}

function AvatarCircle({ avatarFile, className}: AvatarCircleProps) {
  return (
    <div
      className={`${className} w-42 h-42 rounded-full overflow-hidden border-2 flex items-center justify-center`}
      style={{ backgroundColor: '#051240', borderColor: '#DEB992' }}
    >
      <img src={avatarFile ?? "/src/assets/avatars/dog.png"} alt="avatar" className="w-3/4 h-3/4 object-contain" />
    </div>
  )
}

export default AvatarCircle
