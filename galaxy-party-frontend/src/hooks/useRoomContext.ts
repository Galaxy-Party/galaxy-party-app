import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export function useRoomContext() {
    const context = useContext(RoomContext);

    if (!context) {
        throw new Error("useRoomContext must be used within RoomProvider");
    }

    return context;
}
