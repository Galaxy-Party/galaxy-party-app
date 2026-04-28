import {Hello} from "./models.js";
import {User} from "./user/models.js";
import {CreateRoomPayload, Room} from "./room/models.js";

export interface ServerToClientEvents {
    "game:loading": () => void;
    "game:countdown": (count: number) => void;
    "game:started": (data: { currentPlayerId: string }) => void;
    "game:question": (data: { question: { id: string; label: string }; currentPlayerId: string; playerTimes: Record<string, number> }) => void;
    "game:answer_result": (data: { correct: boolean; correctAnswer: string; answeredBy: string; playerTimes: Record<string, number> }) => void;
    "game:over": (data: { winnerId: string }) => void;
    "game:player_quit": () => void;
    "hello:message": (hello: Hello) => void;
    "room:created": (room: Room) => void;
    "room:deleted": (roomId: string) => void;
    "room:list": (rooms: Room[]) => void;
    "room:details": (room: Room) => void;
    "room:user_joined": (user: User) => void;
    "room:user_left": (userId: string) => void;
    "room:owner_changed": (newOwnerId: string) => void;
}

export interface ClientToServerEvents {
    "hello:send": (hello: Hello) => void;
    "room:create": (
        payload: Omit<CreateRoomPayload, "ownerId">,
        ack: (err?: string) => void
    ) => void;
    "room:get_all": (ack: (err?: string) => void) => void;
    "game:start": (payload: { roomId: string; timer: number }, ack: (err?: string) => void) => void;
    "game:player_ready": (payload: { roomId: string }, ack: (err?: string) => void) => void;
    "game:answer": (payload: { roomId: string; answer: string }, ack: (err?: string) => void) => void;
    "game:time_up": (payload: { roomId: string }, ack: (err?: string) => void) => void;
    "game:quit": (payload: { roomId: string }, ack: (err?: string) => void) => void;
    "room:delete": (roomId: string, ack: (err?: string) => void) => void;
    "room:get": (roomId: string, ack: (err?: string) => void) => void;
    "room:leave": (payload: { roomId: string }, ack: (err?: string) => void) => void;
    "room:update": (payload: { roomId: string; timer?: number; password?: string }, ack: (err?: string) => void) => void;
    "room:join": (
        payload: { roomId: string; password?: string },
        ack: (err?: string) => void
    ) => void;
}