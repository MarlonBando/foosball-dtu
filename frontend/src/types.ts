export enum PlayerStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
}

export enum MatchStatus {
  Pending = 0,
  Completed = 1,
  Rejected = 2,
}

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
  t1_gk_status: PlayerStatus;
  t1_st_status: PlayerStatus;
  t2_gk_status: PlayerStatus;
  t2_st_status: PlayerStatus;
}