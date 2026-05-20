import { randomUUID } from 'crypto';
import { TypedServer, TypedSocket } from '../../types/types.js';
import { Friendship, FriendItem, FriendRequest, FriendStatus } from '../../types/friendship/models.js';
import {
    getFriendships,
    createFriendRequest,
    acceptFriendship,
    deleteFriendship,
} from '../../services/friendship.service.js';
import { saveMessage, getConversation } from '../../services/message.service.js';
import { createRoom, joinRoom } from '../../services/room.service.js';
import { getUser } from '../../services/user.service.js';
import { getSession } from '../../store/game.store.js';

const pendingInvites = new Map<string, { fromUserId: string; toUserId: string }>();

function getFriendStatus(io: TypedServer, userId: string): FriendStatus {
    const s = [...io.sockets.sockets.values()].find(s => s.data.userId === userId);
    if (!s) return 'offline';
    if (!s.data.roomId) return 'online';
    return getSession(s.data.roomId) ? 'ingame' : 'inroom';
}

function getFriendRoomId(io: TypedServer, userId: string): string | undefined {
    const s = [...io.sockets.sockets.values()].find(s => s.data.userId === userId);
    return s?.data.roomId;
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
            const status = getFriendStatus(io, friend.id);
            friends.push({
                friendshipId: f.id,
                id: friend.id,
                username: friend.username,
                imageName: friend.imageName ?? null,
                status,
                roomId: (status === 'inroom' || status === 'ingame') ? getFriendRoomId(io, friend.id) : undefined,
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

        const roomId = (status === 'inroom' || status === 'ingame') ? getFriendRoomId(io, userId) : undefined;
        getFriendSockets(io, friendIds).forEach(s => {
            s.emit('friend:status', userId, status, roomId);
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

    socket.on('friend:get_list', async (ack) => {
        await sendFriendList(io, socket);
        ack();
    });

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

    socket.on('friend:invite', async (toUserId, ack) => {
        try {
            const fromUserId = socket.data.userId;
            if (!fromUserId) return ack('Non authentifié');

            const targetSocket = [...io.sockets.sockets.values()].find(s => s.data.userId === toUserId);
            if (!targetSocket) return ack('Ami non connecté');

            const fromUser = await getUser(fromUserId);
            if (!fromUser) return ack('Erreur serveur');

            const inviteId = randomUUID();
            pendingInvites.set(inviteId, { fromUserId, toUserId });

            targetSocket.emit('friend:game_invite', {
                inviteId,
                fromUserId,
                fromUsername: fromUser.username,
                fromImageName: fromUser.imageName ?? null,
            });

            ack();
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('friend:invite_accept', async (inviteId, ack) => {
        try {
            const invite = pendingInvites.get(inviteId);
            if (!invite) return ack('Invitation expirée');
            pendingInvites.delete(inviteId);

            const { fromUserId, toUserId } = invite;

            const [userA, userB] = await Promise.all([getUser(fromUserId), getUser(toUserId)]);
            if (!userA || !userB) return ack('Erreur serveur');

            const room = await createRoom({
                name: `${userA.username}-${userB.username}`,
                ownerId: fromUserId,
                password: null,
            });
            if (!room) return ack('Erreur lors de la création du salon');

            await Promise.all([
                joinRoom(room.id, fromUserId, null),
                joinRoom(room.id, toUserId, null),
            ]);

            const sockets = [...io.sockets.sockets.values()].filter(
                s => s.data.userId === fromUserId || s.data.userId === toUserId
            );
            for (const s of sockets) {
                s.emit('friend:invite_accepted', room.id);
            }

            ack(undefined, room.id);
        } catch (e) {
            ack('Erreur serveur');
        }
    });

    socket.on('friend:invite_decline', async (inviteId, ack) => {
        pendingInvites.delete(inviteId);
        ack();
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
