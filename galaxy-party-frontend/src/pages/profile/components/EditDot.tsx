interface Props {
  size?: number
  onClick: () => void
}

/** Small circular "edit" badge overlaid on the avatar / title. */
export default function EditDot({ size = 22, onClick }: Props) {
  const iconSize = size === 22 ? 10 : 9
  return (
    <div
      onClick={onClick}
      className={`${size === 22 ? 'w-[22px] h-[22px]' : 'w-5 h-5'} rounded-full bg-indigo-deep border-2 border-bg flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.4)] cursor-pointer shrink-0`}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </div>
  )
}
