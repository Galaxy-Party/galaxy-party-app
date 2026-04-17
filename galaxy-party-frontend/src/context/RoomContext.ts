import { createContext } from "react";
import type { CreateRoomPayload, Room } from "../types/room/models.ts";

export type RoomContextType = {
    room: Room | null;
    createRoom: (payload: CreateRoomPayload) => void;
};

export const RoomContext = createContext<RoomContextType | undefined>(undefined);
