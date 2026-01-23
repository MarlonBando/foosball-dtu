import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptMatch, rejectMatch, registerMatch } from '../api/services/matchService';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterMatchRequest } from '../api/types';

export function useAcceptMatch() {
  const queryClient = useQueryClient();
  const { playerId } = useAuth();

  return useMutation({
    mutationFn: ({ matchId }: { matchId: number }) => 
      acceptMatch(matchId, playerId!),
    onSuccess: () => {
      // Invalidate both matches and players (ELO might change)
      queryClient.invalidateQueries({ queryKey: ['matches', playerId] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['currentPlayer'] });
    },
  });
}

export function useRejectMatch() {
  const queryClient = useQueryClient();
  const { playerId } = useAuth();

  return useMutation({
    mutationFn: ({ matchId }: { matchId: number }) => 
      rejectMatch(matchId, playerId!),
    onSuccess: () => {
      // Only invalidate matches (no ELO change on rejection)
      queryClient.invalidateQueries({ queryKey: ['matches', playerId] });
    },
  });
}

export function useRegisterMatch() {
  const queryClient = useQueryClient();
  const { playerId } = useAuth();

  return useMutation({
    mutationFn: (request: RegisterMatchRequest) => registerMatch(request),
    onSuccess: () => {
      // Invalidate matches for the current player
      queryClient.invalidateQueries({ queryKey: ['matches', playerId] });
    },
  });
}
