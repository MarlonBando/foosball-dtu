import { useQuery } from '@tanstack/react-query';
import { getMatchDetails } from '../api/services/matchService';

export function useMatchDetails(matchId: number | null) {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: () => getMatchDetails(matchId!),
    enabled: !!matchId,
  });
}
