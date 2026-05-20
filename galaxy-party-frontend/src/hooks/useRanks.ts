import { useContext } from 'react'
import { RanksContext } from '../context/RanksContext'

export function useRanks() {
    return useContext(RanksContext)
}
