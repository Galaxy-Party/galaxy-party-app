import { User } from '../user/models.js';

export interface Friendship {
    id: string;
    status: 'PENDING' | 'ACCEPTED';
    requester: User;
    addressee: User;
}

export type FriendStatus = 'online' | 'inroom' | 'ingame' | 'offline';

export interface FriendItem {
    friendshipId: string;
    id: string;
    username: string;
    imageName: string | null;
    status: FriendStatus;
    roomId?: string;
}

export interface FriendRequest {
    friendshipId: string;
    id: string;
    username: string;
    imageName: string | null;
}
