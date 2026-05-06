import { get } from '../client';
import type { TournamentKnockoutMatch, TournamentStanding } from '../types';

export async function getTournamentStandings(): Promise<TournamentStanding[]> {
  return get<TournamentStanding[]>('/tournament/standings');
}

export async function getTournamentKnockoutMatches(): Promise<TournamentKnockoutMatch[]> {
  return get<TournamentKnockoutMatch[]>('/tournament/knockout');
}
