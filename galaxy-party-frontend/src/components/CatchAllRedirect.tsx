import { Navigate } from 'react-router-dom'
import { useUserContext } from '../hooks/useUserContext'

export default function CatchAllRedirect() {
    const { user, isLoading } = useUserContext()

    if (isLoading) return null

    return <Navigate to={user ? '/menu' : '/'} replace />
}