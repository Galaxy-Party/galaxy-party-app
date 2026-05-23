import avatars from '../../../assets/avatars'

interface Props {
  selected: number
  onSelect: (index: number) => void
}

/** Grid of selectable avatars for registration. */
export default function AvatarGrid({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {avatars.map((src, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          className={`aspect-square rounded-full border-2 bg-navy flex items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden p-[6px] hover:border-indigo/50 ${i === selected ? 'border-indigo shadow-[0_0_12px_rgba(129,140,248,0.3)]' : 'border-indigo/18'}`}
        >
          <img src={src} alt={`avatar-${i}`} className="w-4/5 h-4/5 object-contain" />
        </div>
      ))}
    </div>
  )
}
