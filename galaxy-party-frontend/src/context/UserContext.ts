import { createContext } from "react";
import type {CreateUserPayload, User} from "../types/user/models.ts";

export type UserContextType = {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
    createUser: (createUserDto: CreateUserPayload) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
