import { useQuery } from '@tanstack/react-query';
import {
  getTournamentKnockoutMatches,
  getTournamentStandings,
} from '../../api/services/tournamentService';

const STANDINGS_QUERY_KEY = ['tournament-standings'] as const;
const KNOCKOUT_QUERY_KEY = ['tournament-knockout'] as const;

export function useTournamentStandings() {
  return useQuery({
    queryKey: STANDINGS_QUERY_KEY,
    queryFn: getTournamentStandings,
  });
}

export function useTournamentKnockoutMatches() {
  return useQuery({
    queryKey: KNOCKOUT_QUERY_KEY,
    queryFn: getTournamentKnockoutMatches,
  });
}
