import {CreateUserPayload, User} from "../types/user/models.js";
import {apiClient} from "../lib/axios.js";


export async function createUser(createUserDto: CreateUserPayload) {
    try {
        const { data: user } = await apiClient.post<User>("/api/users", createUserDto);
        return user;
    } catch (error) {
        console.error(error)
    }
}

export async function getUser(id: string): Promise<User | undefined> {
    try {
        const { data: user } = await apiClient.get<User>(`/api/users/${id}`);
        return user;
    }catch (error) {
        console.error(error)
    }
}