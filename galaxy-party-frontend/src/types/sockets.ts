import type {Hello} from "./models.ts";
import type {User} from "./user/models.ts";
import type {CreateRoomPayload, Room} from "./room/models.ts";

export type FriendStatus = 'online' | 'ingame' | 'offline';

export interface FriendItem {
    friendshipId: string;
    id: string;
    username: string;
    imageName: string | null;
    status: FriendStatus;
}

export interface FriendRequest {
    friendshipId: string;
    id: string;
    username: string;
    imageName: string | null;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    readAt: string | null;
}

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
    "friend:list": (data: { friends: FriendItem[]; requests: FriendRequest[] }) => void;
    "friend:status": (userId: string, status: FriendStatus) => void;
    "friend:requested": (request: FriendRequest) => void;
    "friend:game_invite": (invite: { inviteId: string; fromUserId: string; fromUsername: string; fromImageName: string | null }) => void;
    "friend:invite_accepted": (roomId: string) => void;
    "message:received": (message: ChatMessage) => void;
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
    "room:join": (
        payload: { roomId: string; password?: string },
        ack: (err?: string) => void
    ) => void;
    "room:update": (
        payload: { roomId: string; timer?: number; password?: string },
        ack: (err?: string) => void
    ) => void;
    "friend:get_list": (ack: (err?: string) => void) => void;
    "friend:request": (toUsername: string, ack: (err?: string) => void) => void;
    "friend:accept": (friendshipId: string, ack: (err?: string) => void) => void;
    "friend:decline": (friendshipId: string, ack: (err?: string) => void) => void;
    "friend:invite": (toUserId: string, ack: (err?: string) => void) => void;
    "friend:invite_accept": (inviteId: string, ack: (err?: string, roomId?: string) => void) => void;
    "friend:invite_decline": (inviteId: string, ack: (err?: string) => void) => void;
    "message:send": (payload: { toUserId: string; content: string }, ack: (err?: string, message?: ChatMessage) => void) => void;
    "message:get_history": (payload: { withUserId: string }, ack: (err?: string, messages?: ChatMessage[]) => void) => void;
}
