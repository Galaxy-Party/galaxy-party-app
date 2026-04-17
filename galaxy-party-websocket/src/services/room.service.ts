import {CreateRoomPayload, Room} from "../types/room/models.js";
import {apiClient} from "../lib/axios.js";
import {randomUUID} from "crypto";

export async function getRooms(): Promise<Room[]> {
    const { data } = await apiClient.get<Room[]>("/api/rooms");
    return data;
}

export async function getRoomById(roomId: string): Promise<Room | undefined> {
    try {
        const { data } = await apiClient.get<Room>(`/api/rooms/${roomId}`);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function createRoom(payload: CreateRoomPayload): Promise<Room | undefined> {
    try {
        const { data: room } = await apiClient.post<Room>("/api/rooms", {
            id: randomUUID(),
            name: payload.name,
            password: payload.password ?? null,
            ownerId: payload.ownerId,
        });
        return room;
    } catch (error) {
        console.error(error);
    }
}

export async function joinRoom(roomId: string, userId: string, password?: string | null): Promise<boolean | undefined> {
    try {
        const { data } = await apiClient.post<boolean>(`/api/rooms/join/${roomId}`, {
            userId,
            password: password ?? null,
        });
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function deleteRoom(roomId: string): Promise<void> {
    await apiClient.delete(`/api/rooms/${roomId}`);
}
