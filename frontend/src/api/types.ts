export interface Nationality {
  id: number;
  code: string;
  name: string;
}

export interface Player {
  id: number;
  created_at: string;
  username: string;
  elo: number;
  nationality: number;
  wins: number;
  losses: number;
}

export interface Match {
  id: number;
  created_at: string;
  t1_score: number;
  t2_score: number;
  status: "pending" | "completed" | "rejected";
}

export interface PlayerInMatch {
  player_id: number;
  username: string;
  nationality: number;
  current_elo: number;
  wins: number;
  losses: number;
  is_team1: boolean;
  is_gk: boolean;
  is_win: boolean;
  elo_old: number;
  elo_new: number;
  status: "pending" | "accepted" | "rejected";
}

export interface MatchDetail {
  id: number;
  created_at: string;
  t1_score: number;
  t2_score: number;
  status: "pending" | "completed" | "rejected";
  players: PlayerInMatch[];
}

export interface RegisterMatchRequest {
  t1_gk: number;
  t1_st: number;
  t2_gk: number;
  t2_st: number;
  t1_score: number;
  t2_score: number;
}
