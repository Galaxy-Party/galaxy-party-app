import { apiClient } from '../lib/axios.js';

export interface LevelDefinition {
    levelNumber: number;
    xpRequired: number;
    title: string;
}

export interface GameXpResult {
    winnerXp: number;
    winnerLevel: number;
    winnerLeveledUp: boolean;
    loserXp: number;
    loserLevel: number;
    loserLeveledUp: boolean;
}

let _cachedLevels: LevelDefinition[] | null = null;

export async function getLevelDefinitions(): Promise<LevelDefinition[]> {
    if (_cachedLevels) return _cachedLevels;
    const { data } = await apiClient.get<LevelDefinition[]>('/api/levels/definitions');
    _cachedLevels = data;
    return data;
}

export async function submitCasualResult(winnerId: string, loserId: string): Promise<GameXpResult> {
    const { data } = await apiClient.post<GameXpResult>('/api/levels/game-result', { winnerId, loserId });
    return data;
}
