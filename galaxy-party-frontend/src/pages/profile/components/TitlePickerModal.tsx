import type { LevelDefinition } from '../../../context/LevelsContext'
import { BADGE_STYLE, getTitleColor } from './profileStyles'

interface Props {
    levels: LevelDefinition[]
    userLevel: number
    equippedTitle: string | null
    pendingTitle: LevelDefinition | null
    onSelect: (l: LevelDefinition) => void
    onConfirm: () => void
    onClose: () => void
}

export default function TitlePickerModal({ levels, userLevel, equippedTitle, pendingTitle, onSelect, onConfirm, onClose }: Props) {
    const canConfirm = pendingTitle !== null && pendingTitle.title !== equippedTitle

    return (
        <div
            onClick={e => e.target === e.currentTarget && onClose()}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[4px] flex items-center justify-center"
        >
            <div
                onClick={e => e.stopPropagation()}
                className="card-in bg-panel/96 border border-border rounded-[24px] px-[40px] py-[36px] min-w-[380px] max-w-[460px] shadow-[0_24px_60px_rgba(0,0,0,0.7)] max-h-[80vh] flex flex-col overflow-hidden"
            >
                <div className="font-display font-bold text-[20px] text-indigo mb-1.5">Choisir un titre</div>
                <div className="text-[13px] text-text-dim mb-6">Sélectionnez le titre à afficher sur votre profil</div>

                <div className="scrollbar-indigo overflow-y-auto flex-1 min-h-0 flex flex-col gap-2 overscroll-contain">
                    {levels.map(l => {
                        const locked     = l.levelNumber > userLevel
                        const isPending  = pendingTitle?.title === l.title
                        const isEquipped = !pendingTitle && l.title === equippedTitle
                        const highlighted = isPending || isEquipped
                        const color = getTitleColor(l.levelNumber)

                        return (
                            <div
                                key={l.levelNumber}
                                onClick={() => !locked && onSelect(l)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-[14px] border transition-all duration-200 ${locked ? 'cursor-default border-indigo/20 bg-panel/40' : highlighted ? 'cursor-pointer border-indigo bg-indigo/10' : 'cursor-pointer border-indigo/40 bg-panel/40'}`}
                            >
                                <span
                                    className="font-display text-[12px] font-bold py-1 px-3 rounded-[20px] whitespace-nowrap"
                                    style={{ opacity: locked ? 0.5 : 1, ...BADGE_STYLE[color] }}
                                >
                                    {l.title}
                                </span>
                                <div className={`flex-1 text-[11px] ${locked ? 'text-text/45' : 'text-text-dim'}`}>
                                    {locked ? `🔒 Atteindre le niveau ${l.levelNumber}` : isEquipped ? '✓ Titre actif' : isPending ? '· Sélectionné' : 'Cliquer pour choisir'}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex gap-[10px] justify-center mt-4">
                    <button
                        onClick={onConfirm}
                        disabled={!canConfirm}
                        className="inline-flex items-center justify-center px-7 h-11 rounded-[41px] border-none bg-gradient-to-br from-indigo-deep to-purple text-white font-display text-[14px] font-bold transition-opacity duration-200 disabled:opacity-35 disabled:cursor-default cursor-pointer"
                    >
                        Sélectionner
                    </button>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center px-6 h-11 rounded-[41px] bg-transparent border border-text-dim text-text/60 text-[14px] cursor-pointer"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}
