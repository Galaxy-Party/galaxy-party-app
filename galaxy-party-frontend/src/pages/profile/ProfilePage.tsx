import { useState } from 'react'
import { useUserContext } from '../../hooks/useUserContext'
import { useLevels } from '../../hooks/useLevels'
import type { LevelDefinition } from '../../context/LevelsContext'
import CardHeader from '../../components/CardHeader'
import TitlePickerModal from './components/TitlePickerModal'
import ProfileIdentity from './components/ProfileIdentity'
import ProfileStats from './components/ProfileStats'
import {getTitleColor, type TitleColor} from './components/profileStyles'
import AvatarPickerModal from "./components/AvatarPickerModal";
import { useProfileLiveUpdates } from './hooks/useProfileLiveUpdates'

export default function ProfilePage() {
    const { user, updateProfile } = useUserContext()
    const levels = useLevels()
    const leveledUpMsg = useProfileLiveUpdates()

    const [showAvatarPicker, setShowAvatarPicker] = useState(false)
    const [showTitlePicker,  setShowTitlePicker]  = useState(false)
    const [pendingAvatar,    setPendingAvatar]     = useState<string | null>(null)
    const [pendingTitle,     setPendingTitle]      = useState<LevelDefinition | null>(null)

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

            <div className="card-in relative z-[1] w-full max-w-[860px] bg-panel/82 backdrop-blur-[28px] border border-border rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] mx-auto">

                {/* Level-up toast */}
                {leveledUpMsg && (
                    <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-10 bg-gradient-to-br from-amber/20 to-amber/8 border border-amber/50 rounded-[12px] px-5 py-[10px] font-display font-bold text-[13px] text-amber whitespace-nowrap shadow-[0_4px_20px_rgba(251,191,36,0.2)]">
                        ⭐ {leveledUpMsg}
                    </div>
                )}

                {/* Header */}
                <CardHeader
                    title="Profil"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                        </svg>
                    }
                />

                {/* Scrollable content */}
                <div className="scrollbar-indigo px-8 py-7 overflow-y-auto max-h-[calc(100vh-280px)]">
                    <ProfileIdentity
                        imageName={user?.imageName}
                        username={user?.username}
                        level={level}
                        levelProgress={levelProgress}
                        xp={xp}
                        nextLevelXp={nextLevelDef?.xpRequired ?? null}
                        equippedTitle={equippedTitle}
                        equippedColor={equippedColor}
                        onEditAvatar={() => setShowAvatarPicker(true)}
                        onEditTitle={() => setShowTitlePicker(true)}
                    />

                    <ProfileStats wins={wins} losses={losses} winRate={winRate} elo={elo} xp={xp} level={level} />
                </div>
            </div>
        </>
    )
}
