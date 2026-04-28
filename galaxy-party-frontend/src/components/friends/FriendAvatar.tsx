export default function FriendAvatar({ imageName, size = 42 }: { imageName?: string | null; size?: number }) {
  return (
    <div
      className="rounded-full bg-[#051240] border-2 border-[rgba(129,140,248,0.2)] overflow-hidden flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {imageName
        ? <img src={imageName} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
        : <svg viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth="1.5" width={size * 0.5} height={size * 0.5}>
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
      }
    </div>
  )
}
