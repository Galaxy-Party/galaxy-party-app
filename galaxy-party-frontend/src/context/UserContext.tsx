// client/src/context/UserContext.tsx
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import type {CreateUserPayload, User} from "../types/user/models.ts";
import socket from "../socket/client.ts";
import {useSocket} from "../hooks/useSocket.ts";
import {useNavigate} from "react-router-dom";

export function UserProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [user, setUserState] = useState<User | null>(null);

    const setUser = (user: User) => {
        setUserState(user);
        localStorage.setItem("galaxy-party-user-id", user.id);

        navigate("/menu");
    };
    const logout = () => {
        setUserState(null);
        localStorage.removeItem("galaxy-party-user-id");
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
        setUser(user)
    })

    useSocket("user:received", (user) => {
        setUser(user)
    })

    useEffect(() => {
        const stored = localStorage.getItem("galaxy-party-user-id");

        if (stored) {
            socket.emit("user:get", stored, (err?: string) => {
                if (err) console.error(err);
            })
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, logout, createUser }}>
            {children}
        </UserContext.Provider>
    );
}


