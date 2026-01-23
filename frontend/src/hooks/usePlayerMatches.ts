import { useQuery } from '@tanstack/react-query';
import { getPlayerMatches, getMatchDetails } from '../api/services/matchService';
import type { MatchDetail } from '../api/types';

export function usePlayerMatches(playerId: number | null) {
  return useQuery({
    queryKey: ['matches', playerId],
    queryFn: async (): Promise<MatchDetail[]> => {
      if (!playerId) return [];
      
      // Fetch match list
      const matches = await getPlayerMatches(playerId);
      
      // Fetch all details in parallel (optimized N+1 solution)
      const detailsPromises = matches.map(m => getMatchDetails(m.id));
      return await Promise.all(detailsPromises);
    },
    enabled: !!playerId,
  });
}
