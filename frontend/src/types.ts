export type PlayerStatus = "pending" | "accepted" | "rejected";
export type MatchStatus = "pending" | "completed" | "rejected";

export const PLAYER_STATUS = {
  PENDING: "pending" as PlayerStatus,
  ACCEPTED: "accepted" as PlayerStatus,
  REJECTED: "rejected" as PlayerStatus,
} as const;

export const MATCH_STATUS = {
  PENDING: "pending" as MatchStatus,
  COMPLETED: "completed" as MatchStatus,
  REJECTED: "rejected" as MatchStatus,
} as const;

export interface Nationality {
  id: number;
  code: string;
  name: string;
}

export interface Player {
  id: number;
  created_at: string;
  user_id?: string;
  username: string;
  elo: number;
  name: string;
  surname: string;
  nationality: number;
  wins: number;
  losses: number;
  elo_change?: number;
  elo_old?: number;
  elo_new?: number;
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

export interface MatchDetail {
  id: number;
  created_at: string;
  t1_score: number;
  t2_score: number;
  status: MatchStatus;
  players: PlayerInMatch[];
}

export interface PlayerInMatch {
  player_id: number;
  username: string;
  name: string;
  surname: string;
  nationality: number;
  current_elo: number;
  wins: number;
  losses: number;
  is_team1: boolean;
  is_gk: boolean;
  is_win: boolean;
  elo_old: number;
  elo_new: number;
  status: PlayerStatus;
}