import { useState } from 'react'
import { useUserContext } from '../hooks/useUserContext'
import { useSocket } from '../hooks/useSocket'
import { useLevels } from '../hooks/useLevels'
import type { LevelDefinition } from '../context/LevelsContext'
import AvatarPickerModal from '../components/profile/AvatarPickerModal'
import TitlePickerModal from '../components/profile/TitlePickerModal'
import { AMBER, BADGE_STYLE, EMERALD, INDIGO, ROSE, getTitleColor } from '../components/profile/profileStyles'
import type { TitleColor } from '../components/profile/profileStyles'

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-[#f472b6] mb-[14px] flex items-center gap-[10px]">
            {children}
            <span className="flex-1 h-px bg-[rgba(244,114,182,0.2)]" />
        </div>
    )
}

function StatCard({ val, label, color }: { val: number | string; label: string; color: string }) {
    return (
        <div className="bg-[rgba(12,8,28,0.5)] border border-[rgba(129,140,248,0.22)] rounded-[14px] p-[14px] text-center">
            <div className="font-display font-bold text-[22px]" style={{ color }}>{val}</div>
            <div className="text-[11px] text-[rgba(241,240,255,0.35)] mt-1 tracking-[0.08em] uppercase">{label}</div>
        </div>
    )
}

function EditDot({ size = 22, onClick }: { size?: number; onClick: () => void }) {
    const sz = size === 22 ? 'w-[22px] h-[22px]' : 'w-5 h-5'
    const iconSz = size === 22 ? 10 : 9
    return (
        <div
            onClick={onClick}
            className={`${sz} rounded-full bg-[#4f46e5] border-2 border-[#07050f] flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.4)] cursor-pointer shrink-0`}
        >
            <svg width={iconSz} height={iconSz} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
        </div>
    )
}

export default function ProfilePage() {
    const { user, updateProfile, updateElo } = useUserContext()
    const levels = useLevels()

    const [showAvatarPicker, setShowAvatarPicker] = useState(false)
    const [showTitlePicker,  setShowTitlePicker]  = useState(false)
    const [pendingAvatar,    setPendingAvatar]     = useState<string | null>(null)
    const [pendingTitle,     setPendingTitle]      = useState<LevelDefinition | null>(null)
    const [leveledUpMsg,     setLeveledUpMsg]      = useState<string | null>(null)

    useSocket('profile:xp_updated', ({ level, leveledUp }) => {
        if (leveledUp) {
            const t = levels.find(l => l.levelNumber === level)?.title
            setLeveledUpMsg(`Niveau ${level} atteint${t ? ` — "${t}" débloqué` : ''} !`)
            setTimeout(() => setLeveledUpMsg(null), 5000)
        }
    })
    useSocket('ranked:elo_updated', updateElo)

    const elo         = user?.elo ?? 0
    const xp          = user?.xp ?? 0
    const level       = user?.level ?? 1
    const wins        = user?.wins ?? 0
    const gamesPlayed = user?.gamesPlayed ?? 0
    const losses      = gamesPlayed - wins
    const winRate     = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0

    const currentLevelDef = levels.find(l => l.levelNumber === level)
    const nextLevelDef    = levels.find(l => l.levelNumber === level + 1)
    const levelProgress   = currentLevelDef && nextLevelDef
        ? Math.min(100, Math.round(((xp - currentLevelDef.xpRequired) / (nextLevelDef.xpRequired - currentLevelDef.xpRequired)) * 100))
        : currentLevelDef ? 100 : 0

    const unlockedLevels = levels.filter(l => l.levelNumber <= level)
    const equippedTitle  = user?.equippedTitle ?? (unlockedLevels.at(-1)?.title ?? null)
    const equippedColor: TitleColor = getTitleColor(levels.find(l => l.title === equippedTitle)?.levelNumber ?? 1)

    const handleConfirmAvatar = async () => {
        if (!pendingAvatar) return
        await updateProfile({ imageName: pendingAvatar }).catch(() => {})
        setShowAvatarPicker(false)
        setPendingAvatar(null)
    }

    const handleConfirmTitle = async () => {
        if (!pendingTitle || pendingTitle.levelNumber > level) return
        await updateProfile({ equippedTitle: pendingTitle.title }).catch(() => {})
        setShowTitlePicker(false)
        setPendingTitle(null)
    }

    return (
        <>
            {showAvatarPicker && (
                <AvatarPickerModal
                    currentImageName={user?.imageName}
                    pendingAvatar={pendingAvatar}
                    onSelect={setPendingAvatar}
                    onConfirm={handleConfirmAvatar}
                    onClose={() => { setShowAvatarPicker(false); setPendingAvatar(null) }}
                />
            )}
            {showTitlePicker && (
                <TitlePickerModal
                    levels={levels}
                    userLevel={level}
                    equippedTitle={equippedTitle}
                    pendingTitle={pendingTitle}
                    onSelect={setPendingTitle}
                    onConfirm={handleConfirmTitle}
                    onClose={() => { setShowTitlePicker(false); setPendingTitle(null) }}
                />
            )}

            <div className="card-in relative z-[1] w-full max-w-[860px] bg-[rgba(12,8,28,0.82)] backdrop-blur-[28px] border border-[rgba(129,140,248,0.22)] rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] mx-auto">

                {/* Level-up toast */}
                {leveledUpMsg && (
                    <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-10 bg-gradient-to-br from-[rgba(251,191,36,0.2)] to-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.5)] rounded-[12px] px-5 py-[10px] font-display font-bold text-[13px] text-[#fbbf24] whitespace-nowrap shadow-[0_4px_20px_rgba(251,191,36,0.2)]">
                        ⭐ {leveledUpMsg}
                    </div>
                )}

                {/* Header */}
                <div className="px-8 pt-5 pb-4 border-b border-[rgba(129,140,248,0.12)] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[rgba(129,140,248,0.1)] border border-[rgba(129,140,248,0.25)] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                        </svg>
                    </div>
                    <span className="font-display font-bold text-[17px] tracking-[0.02em] text-[#f1f0ff]">Profil</span>
                </div>

                {/* Scrollable content */}
                <div className="scrollbar-indigo px-8 py-7 overflow-y-auto max-h-[calc(100vh-280px)]">

                    {/* Identity block */}
                    <div className="flex items-center gap-5 mb-7 px-[22px] py-5 bg-[rgba(12,8,28,0.5)] border border-[rgba(129,140,248,0.22)] rounded-[20px]">

                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div
                                onClick={() => setShowAvatarPicker(true)}
                                className="w-[72px] h-[72px] rounded-full bg-[#051240] border-2 border-[#818cf8] hover:border-[rgba(129,140,248,0.9)] overflow-hidden flex items-center justify-center cursor-pointer transition-[border-color] duration-200"
                            >
                                {user?.imageName
                                    ? <img src={user.imageName} alt="avatar" className="w-[75%] h-[75%] object-contain" />
                                    : <svg viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="1.5" className="w-8 h-8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                                }
                            </div>
                            <div className="absolute bottom-0 right-0">
                                <EditDot size={22} onClick={() => setShowAvatarPicker(true)} />
                            </div>
                        </div>

                        {/* Name + title */}
                        <div className="flex-1 min-w-0">
                            <div className="font-display font-bold text-[20px] text-[#f1f0ff] overflow-hidden text-ellipsis whitespace-nowrap">
                                {user?.username}
                            </div>
                            {equippedTitle && (
                                <div className="inline-flex items-center gap-1.5 mt-2 cursor-pointer" onClick={() => setShowTitlePicker(true)}>
                                    <span
                                        className="font-display text-[12px] font-bold py-[3px] px-3 rounded-[20px]"
                                        style={BADGE_STYLE[equippedColor]}
                                    >
                                        {equippedTitle}
                                    </span>
                                    <EditDot size={20} onClick={() => setShowTitlePicker(true)} />
                                </div>
                            )}
                        </div>

                        {/* Level + XP */}
                        <div className="text-right shrink-0">
                            <div className="font-display text-[11px] text-[rgba(241,240,255,0.35)] tracking-[0.15em] uppercase mb-1.5">Niveau</div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center font-display text-[15px] font-bold text-white ml-auto shadow-[0_0_8px_rgba(129,140,248,0.4)]">
                                {level}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 w-[120px]">
                                <div className="flex-1 h-1 rounded-sm bg-[rgba(129,140,248,0.15)] overflow-hidden">
                                    <div
                                        className="h-full rounded-sm transition-[width] duration-[600ms] ease-out"
                                        style={{ background: `linear-gradient(90deg,${INDIGO},${ROSE})`, width: `${levelProgress}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-[rgba(241,240,255,0.35)] whitespace-nowrap">
                                    {nextLevelDef ? `${xp}/${nextLevelDef.xpRequired}` : `${xp} XP`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <SectionTitle>Statistiques</SectionTitle>
                    <div className="grid grid-cols-3 gap-[10px] mb-[10px]">
                        <StatCard val={wins}          label="Victoires" color={INDIGO}   />
                        <StatCard val={losses}        label="Défaites"  color={ROSE}     />
                        <StatCard val={`${winRate}%`} label="Win rate"  color={AMBER}    />
                    </div>
                    <div className="grid grid-cols-3 gap-[10px]">
                        <StatCard val={elo}   label="ELO"      color={AMBER}   />
                        <StatCard val={xp}    label="XP Total" color={EMERALD} />
                        <StatCard val={level} label="Niveau"   color={INDIGO}  />
                    </div>

                </div>
            </div>
        </>
    )
}
