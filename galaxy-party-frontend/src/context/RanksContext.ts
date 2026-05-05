import { createContext } from 'react'
import type { RankDefinition } from '../utils/rank'

export const RanksContext = createContext<RankDefinition[]>([])
