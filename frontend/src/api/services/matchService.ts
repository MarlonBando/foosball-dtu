import { get, post, patch } from '../client';
import type { Match, MatchDetail, RegisterMatchRequest } from '../types';

export async function getPlayerMatches(playerId: number): Promise<Match[]> {
  return get<Match[]>(`/matches?playerid=${playerId}`);
}

export async function getMatchDetails(matchId: number): Promise<MatchDetail> {
  return get<MatchDetail>(`/match/${matchId}`);
}

export async function registerMatch(request: RegisterMatchRequest): Promise<Match> {
  return post<Match>('/matches/register', request);
}

export async function acceptMatch(matchId: number, playerId: number): Promise<void> {
  await patch(`/matches/${matchId}/accept?playerId=${playerId}`);
}

export async function rejectMatch(matchId: number, playerId: number): Promise<void> {
  await patch(`/matches/${matchId}/reject?playerId=${playerId}`);
}
