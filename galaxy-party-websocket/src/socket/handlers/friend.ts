import { TypedServer, TypedSocket } from '../../types/types.js';
import { Friendship, FriendItem, FriendRequest, FriendStatus } from '../../types/friendship/models.js';
import {
    getFriendships,
    createFriendRequest,
    acceptFriendship,
    deleteFriendship,
} from '../../services/friendship.service.js';
import { saveMessage, getConversation } from '../../services/message.service.js';

function getFriendStatus(io: TypedServer, userId: string): FriendStatus {
    const s = [...io.sockets.sockets.values()].find(s => s.data.userId === userId);
    if (!s) return 'offline';
    return s.data.roomId ? 'ingame' : 'online';
}

function getFriendSockets(io: TypedServer, friendIds: string[]) {
    return [...io.sockets.sockets.values()].filter(
        s => s.data.userId && friendIds.includes(s.data.userId)
    );
}

function buildLists(friendships: Friendship[], userId: string, io: TypedServer) {
    const friends: FriendItem[] = [];
    const requests: FriendRequest[] = [];

    for (const f of friendships) {
        const iAmRequester = f.requester.id === userId;
        const friend = iAmRequester ? f.addressee : f.requester;

        if (f.status === 'ACCEPTED') {
            friends.push({
                friendshipId: f.id,
                id: friend.id,
                username: friend.username,
                imageName: friend.imageName ?? null,
                status: getFriendStatus(io, friend.id),
            });
        } else if (f.status === 'PENDING' && !iAmRequester) {
            requests.push({
                friendshipId: f.id,
                id: f.requester.id,
                username: f.requester.username,
                imageName: f.requester.imageName ?? null,
            });
        }
    }

    return { friends, requests };
}

export async function broadcastStatus(io: TypedServer, userId: string, status: FriendStatus) {
    try {
        const friendships = await getFriendships(userId);
        const friendIds = friendships
            .filter(f => f.status === 'ACCEPTED')
            .map(f => f.requester.id === userId ? f.addressee.id : f.requester.id);

        getFriendSockets(io, friendIds).forEach(s => {
            s.emit('friend:status', userId, status);
        });
    } catch (e) {
        console.error('broadcastStatus error:', e);
    }
}

export async function sendFriendList(io: TypedServer, socket: TypedSocket) {
    try {
        const userId = socket.data.userId!;
        const friendships = await getFriendships(userId);
        const { friends, requests } = buildLists(friendships, userId, io);
        socket.emit('friend:list', { friends, requests });
    } catch (e) {
        console.error('sendFriendList error:', e);
    }
}

export function registerFriendHandlers(io: TypedServer, socket: TypedSocket) {

    socket.on('friend:request', async (toUsername, ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack('Non authentifié');

            const friendship = await createFriendRequest(userId, toUsername);

            const targetSocket = [...io.sockets.sockets.values()].find(s => s.data.userId === friendship.addressee.id);
            if (targetSocket) {
                targetSocket.emit('friend:requested', {
                    friendshipId: friendship.id,
                    id: friendship.requester.id,
                    username: friendship.requester.username,
                    imageName: friendship.requester.imageName ?? null,
                });
            }

            ack();
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('friend:accept', async (friendshipId, ack) => {
        try {
            const friendship = await acceptFriendship(friendshipId);
            const both = [friendship.requester.id, friendship.addressee.id];
            const sockets = [...io.sockets.sockets.values()].filter(s => s.data.userId && both.includes(s.data.userId));
            for (const s of sockets) {
                await sendFriendList(io, s);
            }

            ack();
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('friend:decline', async (friendshipId, ack) => {
        try {
            await deleteFriendship(friendshipId);
            ack();
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('message:send', async ({ toUserId, content }, ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack('Non authentifié');

            const message = await saveMessage(userId, toUserId, content);
            const targetSocket = [...io.sockets.sockets.values()].find(s => s.data.userId === toUserId);
            if (targetSocket) {
                targetSocket.emit('message:received', message);
            }

            ack(undefined, message);
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('message:get_history', async ({ withUserId }, ack) => {
        try {
            const userId = socket.data.userId;
            if (!userId) return ack('Non authentifié');

            const messages = await getConversation(userId, withUserId);
            ack(undefined, messages);
        } catch (e) {
            ack('Erreur serveur');
        }
    });
}
