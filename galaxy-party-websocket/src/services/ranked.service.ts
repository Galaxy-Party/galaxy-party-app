import { apiClient } from '../lib/axios.js';

interface RankedResultResponse {
    winnerElo: number;
    loserElo: number;
}

export interface LeaderboardEntry {
    id: string;
    username: string;
    imageName: string | null;
    elo: number;
}

export interface RankDefinition {
    name: string;
    icon: string;
    color: string;
    minElo: number;
    maxElo: number | null;
    next: string | null;
}

let _cachedRanks: RankDefinition[] | null = null;

export async function submitRankedResult(winnerId: string, loserId: string): Promise<RankedResultResponse> {
    const { data } = await apiClient.post<RankedResultResponse>('/api/ranked/result', { winnerId, loserId });
    return data;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data } = await apiClient.get<LeaderboardEntry[]>('/api/ranked/leaderboard');
    return data;
}

export async function getRankDefinitions(): Promise<RankDefinition[]> {
    if (_cachedRanks) return _cachedRanks;
    const { data } = await apiClient.get<RankDefinition[]>('/api/ranked/definitions');
    _cachedRanks = data;
    return data;
}
