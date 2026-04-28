import {Navigate, Outlet} from "react-router-dom";
import {useUserContext} from "../hooks/useUserContext.ts";

export default function ProtectedRoute() {
    const {user, isLoading} = useUserContext();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace/>;
    }

    return <Outlet />;
}