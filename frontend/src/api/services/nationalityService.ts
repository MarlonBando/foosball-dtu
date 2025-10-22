import { get } from '../client';
import type { Nationality } from '../types';

export async function getAllNationalities(): Promise<Nationality[]> {
  return get<Nationality[]>('/nationalities');
}
