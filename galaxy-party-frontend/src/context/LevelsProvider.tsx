import { useState } from 'react'
import { LevelsContext } from './LevelsContext'
import type { LevelDefinition } from './LevelsContext'
import { useSocket } from '../hooks/useSocket'

export default function LevelsProvider({ children }: { children: React.ReactNode }) {
    const [levels, setLevels] = useState<LevelDefinition[]>([])
    useSocket('levels:definitions', setLevels)
    return <LevelsContext.Provider value={levels}>{children}</LevelsContext.Provider>
}
