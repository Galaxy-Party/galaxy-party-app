import { useContext } from 'react'
import { LevelsContext } from '../context/LevelsContext'

export function useLevels() {
    return useContext(LevelsContext)
}
