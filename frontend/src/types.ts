export type MatchStatus = 'pending' | 'accepted' | 'completed';

export interface Player {
  id: number;
  created_at: string;
  username: string;
  elo: number;
  name: string;
  surname: string;
  nationality: number;
  wins: number;
  losses: number;
}

export interface Match {
  id: number | null;
  created_at: string | null;
  t1_gk: Player | null;
  t1_st: Player | null;
  t2_gk: Player | null;
  t2_st: Player | null;
  table: number | null;
  t1_score: number;
  t2_score: number;
  status: MatchStatus;
}
