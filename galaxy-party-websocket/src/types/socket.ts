import {Hello} from "./models.js";
import {User} from "./user/models.js";
import {CreateRoomPayload, Room} from "./room/models.js";
import {FriendItem, FriendRequest, FriendStatus} from "./friendship/models.js";
import {Message} from "./message/models.js";

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
    "game:spectator_state": (data: { question: { id: string; label: string } | null; currentPlayerId: string; playerTimes: Record<string, number> }) => void;
    "friend:list": (data: { friends: FriendItem[]; requests: FriendRequest[] }) => void;
    "friend:status": (userId: string, status: FriendStatus, roomId?: string) => void;
    "friend:requested": (request: FriendRequest) => void;
    "friend:game_invite": (invite: { inviteId: string; fromUserId: string; fromUsername: string; fromImageName: string | null }) => void;
    "friend:invite_accepted": (roomId: string) => void;
    "message:received": (message: Message) => void;
    "ranked:match_found": (data: { roomId: string; opponent: { userId: string; username: string; imageName: string | null; elo: number } }) => void;
    "ranked:elo_updated": (newElo: number) => void;
    "ranked:leaderboard": (data: { entries: { id: string; username: string; imageName: string | null; elo: number }[]; myElo: number }) => void;
    "ranked:session_started": () => void;
    "ranked:ranks": (ranks: { name: string; icon: string; color: string; minElo: number; maxElo: number | null; next: string | null }[]) => void;
    "levels:definitions": (levels: { levelNumber: number; xpRequired: number; title: string }[]) => void;
    "profile:xp_updated": (data: { xp: number; level: number; leveledUp: boolean }) => void;
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
    "room:spectate": (payload: { roomId: string }, ack: (err?: string) => void) => void;
    "room:spectate_leave": (payload: { roomId: string }, ack: (err?: string) => void) => void;
    "friend:get_list": (ack: (err?: string) => void) => void;
    "friend:request": (toUsername: string, ack: (err?: string) => void) => void;
    "friend:accept": (friendshipId: string, ack: (err?: string) => void) => void;
    "friend:decline": (friendshipId: string, ack: (err?: string) => void) => void;
    "friend:invite": (toUserId: string, ack: (err?: string) => void) => void;
    "friend:invite_accept": (inviteId: string, ack: (err?: string, roomId?: string) => void) => void;
    "friend:invite_decline": (inviteId: string, ack: (err?: string) => void) => void;
    "message:send": (payload: { toUserId: string; content: string }, ack: (err?: string, message?: Message) => void) => void;
    "message:get_history": (payload: { withUserId: string }, ack: (err?: string, messages?: Message[]) => void) => void;
    "ranked:join_queue": (ack: (err?: string) => void) => void;
    "ranked:leave_queue": (ack: (err?: string) => void) => void;
    "ranked:get_leaderboard": (ack: (err?: string) => void) => void;
}