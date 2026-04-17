import { Question } from '../types/game/models.js';
import { apiClient } from '../lib/axios.js';

export async function getQuestions(): Promise<Question[]> {
    const { data } = await apiClient.get<Question[]>('/api/questions');
    return data;
}