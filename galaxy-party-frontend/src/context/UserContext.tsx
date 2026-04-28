import { useCallback, useEffect, useState } from 'react'
import { UserContext } from './UserContext'
import type { User } from '../types/user/models.ts'
import { ApiError } from '../api/client.ts'
import { authApi, type LoginPayload, type RegisterPayload, type UpdateProfilePayload } from '../api/auth.ts'
import socket from '../socket/client.ts'

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        authApi.me()
            .then(u => { if (!cancelled) setUser(u) })
            .catch(err => {
                if (!(err instanceof ApiError && err.status === 401)) console.error(err)
            })
            .finally(() => { if (!cancelled) setIsLoading(false) })
        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        if (!user) {
            if (socket.connected) socket.disconnect()
            return
        }
        if (!socket.connected) socket.connect()
    }, [user])

    const register = useCallback(async (payload: RegisterPayload) => {
        const u = await authApi.register(payload)
        setUser(u)
        return u
    }, [])

    const login = useCallback(async (payload: LoginPayload, imageName?: string) => {
        const u = await authApi.login(payload)
        if (imageName && imageName !== u.imageName) {
            const updated = await authApi.updateProfile({ imageName })
            setUser(updated)
            return updated
        }
        setUser(u)
        return u
    }, [])

    const logout = useCallback(async () => {
        try { await authApi.logout() } catch { /* ignore */ }
        setUser(null)
    }, [])

    const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
        const u = await authApi.updateProfile(payload)
        setUser(u)
        return u
    }, [])

    return (
        <UserContext.Provider value={{ user, isLoading, register, login, logout, updateProfile }}>
            {children}
        </UserContext.Provider>
    )
}