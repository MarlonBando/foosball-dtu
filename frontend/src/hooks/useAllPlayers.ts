import { useQuery } from '@tanstack/react-query';
import { getAllPlayers } from '../api/services/playerService';

export function useAllPlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: getAllPlayers,
  });
}
