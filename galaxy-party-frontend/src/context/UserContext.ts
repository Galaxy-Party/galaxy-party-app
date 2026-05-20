import { createContext } from 'react'
import type { User } from '../types/user/models.ts'
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from '../api/auth.ts'

export type UserContextType = {
    user: User | null
    isLoading: boolean
    register: (payload: RegisterPayload) => Promise<User>
    login: (payload: LoginPayload) => Promise<User>
    logout: () => Promise<void>
    updateProfile: (payload: UpdateProfilePayload) => Promise<User>
    updateElo: (newElo: number) => void
    updateXp: (xp: number, level: number) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)