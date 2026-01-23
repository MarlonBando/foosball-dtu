import { useQuery } from '@tanstack/react-query';
import { getCurrentPlayer } from '../api/services/playerService';

export function useCurrentPlayer() {
  return useQuery({
    queryKey: ['currentPlayer'],
    queryFn: getCurrentPlayer,
  });
}
