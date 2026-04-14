import { useEffect } from "react";
import socket from "../socket/client";
import type {ServerToClientEvents} from "../types/sockets.ts";

export function useSocket<K extends keyof ServerToClientEvents>(
    event: K,
    handler: ServerToClientEvents[K]
) {
    useEffect(() => {
        socket.on(event, handler as never);

        return () => {
            socket.off(event, handler as never);
        };
    }, [event, handler]);
}