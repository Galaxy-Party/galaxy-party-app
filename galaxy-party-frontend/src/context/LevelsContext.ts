import { createContext } from 'react'

export interface LevelDefinition {
    levelNumber: number
    xpRequired: number
    title: string
}

export const LevelsContext = createContext<LevelDefinition[]>([])
