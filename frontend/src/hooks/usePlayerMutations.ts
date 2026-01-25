import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPlayer } from '../api/services/playerService';
import type { Player } from '../api/types';

export function useAddPlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playerData: Omit<Player, 'id' | 'created_at'>) => 
      addPlayer(playerData),
    onSuccess: () => {
      // Invalidate players list
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}
