import { apiClient } from '../lib/axios.js';
import { Message } from '../types/message/models.js';

export async function getConversation(userA: string, userB: string): Promise<Message[]> {
    const { data } = await apiClient.get<Message[]>('/api/messages', {
        params: { between: userA, and: userB },
    });
    return data;
}

export async function saveMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const { data } = await apiClient.post<Message>('/api/messages', { senderId, receiverId, content });
    return data;
}
