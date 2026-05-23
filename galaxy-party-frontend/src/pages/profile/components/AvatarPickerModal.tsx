import avatars from '../../../assets/avatars'

interface Props {
    currentImageName?: string | null
    pendingAvatar: string | null
    onSelect: (src: string) => void
    onConfirm: () => void
    onClose: () => void
}

export default function AvatarPickerModal({ currentImageName, pendingAvatar, onSelect, onConfirm, onClose }: Props) {
    const hasChange = pendingAvatar !== null && pendingAvatar !== currentImageName

    return (
        <div
            onClick={e => e.target === e.currentTarget && onClose()}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[4px] flex items-center justify-center"
        >
            <div
                onClick={e => e.stopPropagation()}
                className="card-in bg-panel/96 border border-border rounded-[24px] px-[40px] py-[36px] min-w-[380px] max-w-[440px] shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
            >
                <div className="font-display font-bold text-[20px] text-indigo mb-1.5">Changer d'avatar</div>
                <div className="text-[13px] text-text-dim mb-6">Choisissez votre nouvel avatar</div>

                <div className="grid grid-cols-5 gap-[10px]">
                    {avatars.map((src, i) => {
                        const active = pendingAvatar ? src === pendingAvatar : src === currentImageName
                        return (
                            <div
                                key={i}
                                onClick={() => onSelect(src)}
                                className={`aspect-square rounded-full bg-navy flex items-center justify-center cursor-pointer overflow-hidden p-2 border-2 transition-all duration-200 ${active ? 'border-indigo shadow-[0_0_16px_rgba(129,140,248,0.25)]' : 'border-indigo/20'}`}
                            >
                                <img src={src} alt="" className="w-[80%] h-[80%] object-contain" />
                            </div>
                        )
                    })}
                </div>

                <div className="flex gap-[10px] justify-center mt-5">
                    <button
                        onClick={onConfirm}
                        disabled={!hasChange}
                        className="inline-flex items-center justify-center px-7 h-11 rounded-[41px] border-none bg-gradient-to-br from-indigo-deep to-purple text-white font-display text-[14px] font-bold transition-opacity duration-200 disabled:opacity-35 disabled:cursor-default cursor-pointer"
                    >
                        Sélectionner
                    </button>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center px-6 h-11 rounded-[41px] bg-transparent border border-text-dim text-text/60 text-[14px] cursor-pointer"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    )
}
