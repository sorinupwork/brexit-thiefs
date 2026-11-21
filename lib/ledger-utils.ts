/**
 * Sums numeric values inside a vote/flag count map.
 */
export function sumVoteMap(counts?: Record<string, number>): number {
  return Object.values(counts ?? {}).reduce((sum, n) => sum + n, 0);
}
