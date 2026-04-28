import { apiClient } from '../lib/axios.js';
import { Friendship } from '../types/friendship/models.js';

export async function getFriendships(userId: string): Promise<Friendship[]> {
    const { data } = await apiClient.get<Friendship[]>('/api/friendships', { params: { userId } });
    return data;
}

export async function createFriendRequest(requesterId: string, addresseeUsername: string): Promise<Friendship> {
    const { data } = await apiClient.post<Friendship>('/api/friendships', { requesterId, addresseeUsername });
    return data;
}

export async function acceptFriendship(friendshipId: string): Promise<Friendship> {
    const { data } = await apiClient.put<Friendship>(`/api/friendships/${friendshipId}/accept`);
    return data;
}

export async function deleteFriendship(friendshipId: string): Promise<void> {
    await apiClient.delete(`/api/friendships/${friendshipId}`);
}
