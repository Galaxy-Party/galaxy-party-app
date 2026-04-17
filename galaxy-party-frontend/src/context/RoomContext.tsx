import { useState } from "react";
import { RoomContext } from "./RoomContext";
import type { CreateRoomPayload, Room } from "../types/room/models.ts";
import socket from "../socket/client.ts";
import { useSocket } from "../hooks/useSocket.ts";
import { useNavigate } from "react-router-dom";

export function RoomProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [room, setRoom] = useState<Room | null>(null);

    const createRoom = (payload: CreateRoomPayload) => {
        socket.emit("room:create", payload, (err?: string) => {
            if (err) console.error(err);
        });
    };

    useSocket("room:created", (createdRoom) => {
        setRoom(createdRoom);
        navigate(`/rooms/${createdRoom.id}`);
    });

    return (
        <RoomContext.Provider value={{ room, createRoom }}>
            {children}
        </RoomContext.Provider>
    );
}
