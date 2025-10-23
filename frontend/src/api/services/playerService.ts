import { get, post } from '../client';
import type { Player } from '../types';

export async function getAllPlayers(): Promise<Player[]> {
  return get<Player[]>('/players');
}

export async function getCurrentPlayer(): Promise<Player> {
  return get<Player>('/players/me');
}

export async function addPlayer(player: Omit<Player, 'id' | 'created_at'>): Promise<Player> {
  return post<Player>('/players/add', player);
}
