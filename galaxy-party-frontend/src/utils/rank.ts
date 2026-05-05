export interface RankDefinition {
  name: string
  icon: string
  color: string
  minElo: number
  maxElo: number | null
  next: string | null
}

export function getRankInfo(elo: number, ranks: RankDefinition[]): RankDefinition | null {
  return ranks.find(r => elo >= r.minElo && (r.maxElo === null || elo <= r.maxElo)) ?? ranks[0] ?? null
}

export function getProgressToNext(elo: number, rank: RankDefinition): number {
  if (rank.maxElo === null) return 100
  return Math.round(((elo - rank.minElo) / (rank.maxElo + 1 - rank.minElo)) * 100)
}
