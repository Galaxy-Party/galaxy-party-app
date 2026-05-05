import { useState, type ReactNode } from 'react'
import { useSocket } from '../hooks/useSocket'
import { RanksContext } from './RanksContext'
import type { RankDefinition } from '../utils/rank'

export default function RanksProvider({ children }: { children: ReactNode }) {
    const [ranks, setRanks] = useState<RankDefinition[]>([])
    useSocket('ranked:ranks', setRanks)
    return <RanksContext.Provider value={ranks}>{children}</RanksContext.Provider>
}
