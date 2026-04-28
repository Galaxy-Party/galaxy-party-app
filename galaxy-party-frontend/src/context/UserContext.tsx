// client/src/context/UserContext.tsx
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import type {CreateUserPayload, User} from "../types/user/models.ts";
import socket from "../socket/client.ts";
import {useSocket} from "../hooks/useSocket.ts";
import {useNavigate} from "react-router-dom";
export function UserProvider({ children }: { children: React.ReactNode }) {
    const stored = localStorage.getItem("galaxy-party-user-id");
    const navigate = useNavigate();
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(!!stored);

    const setUser = (user: User) => {
        setUserState(user);
        localStorage.setItem("galaxy-party-user-id", user.id);
        socket.emit("user:register", user.id);
        setIsLoading(false);
    };
    const logout = () => {
        setUserState(null);
        localStorage.removeItem("galaxy-party-user-id");

        setIsLoading(false);
    };

    const createUser = (createUserDto: CreateUserPayload) => {
        socket.emit(
            "user:create",
            createUserDto,
            (err?: string) => {
                if (err) console.error(err);
            }
        );
    }

    useSocket("user:created", (user) => {
        setUser(user);
        navigate("/menu");
    })

    useSocket("user:received", (user) => {
        setUser(user);
    })

    useEffect(() => {
        if (!stored) return;

        socket.emit("user:get", stored, (err?: string) => {
            if (err) console.error(err);
            setIsLoading(false);
        })
    }, [stored]);

    useEffect(() => {
        const handleReconnect = () => {
            if (user) socket.emit("user:register", user.id);
        };
        socket.on("connect", handleReconnect);
        return () => { socket.off("connect", handleReconnect); };
    }, [user]);


    return (
        <UserContext.Provider value={{ user, setUser, logout, createUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}


