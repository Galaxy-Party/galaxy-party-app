import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export function useUserContext() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }

    return context;
}