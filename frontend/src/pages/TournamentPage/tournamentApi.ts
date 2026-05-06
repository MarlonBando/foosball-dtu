import { supabase } from '../../lib/supabase';

export type KnockoutStage = 'r16' | 'qf' | 'sf' | 'final';

export interface TournamentStanding {
  group: string;
  team: string;
  team_id: number;
  points: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
}

interface TournamentKnockoutQueryRow {
  stage: KnockoutStage;
  slot: number;
  team1: { name: string }[] | { name: string } | null;
  team2: { name: string }[] | { name: string } | null;
  team1_score: number | null;
  team2_score: number | null;
  status: 'pending' | 'completed';
  winner_id: number | null;
}

export interface TournamentKnockoutMatch {
  stage: KnockoutStage;
  slot: number;
  team1: string | null;
  team2: string | null;
  team1_score: number | null;
  team2_score: number | null;
  status: 'pending' | 'completed';
  winner_id: number | null;
}

const getTeamName = (team: { name: string }[] | { name: string } | null): string | null => {
  if (!team) return null;
  if (Array.isArray(team)) return team[0]?.name ?? null;
  return team.name;
};

const standingsSort = (a: TournamentStanding, b: TournamentStanding) => {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goal_diff !== a.goal_diff) return b.goal_diff - a.goal_diff;
  if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;
  return a.team.localeCompare(b.team);
};

export async function getTournamentStandings(): Promise<TournamentStanding[]> {
  const { data, error } = await supabase
    .from('tournament_standings')
    .select('group, team, team_id, points, goals_for, goals_against, goal_diff')
    .order('group', { ascending: true })
    .order('points', { ascending: false })
    .order('goal_diff', { ascending: false })
    .order('goals_for', { ascending: false });

  if (error) throw error;

  return [...(data ?? [])].sort(standingsSort);
}

export async function getTournamentKnockoutMatches(): Promise<TournamentKnockoutMatch[]> {
  const { data, error } = await supabase
    .from('tournament_knockout_matches')
    .select(`
      stage,
      slot,
      team1:tournament_teams!team1_id(name),
      team2:tournament_teams!team2_id(name),
      team1_score,
      team2_score,
      status,
      winner_id
    `)
    .order('stage', { ascending: true })
    .order('slot', { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as TournamentKnockoutQueryRow[];

  return rows.map((row) => ({
    stage: row.stage,
    slot: row.slot,
    team1: getTeamName(row.team1),
    team2: getTeamName(row.team2),
    team1_score: row.team1_score,
    team2_score: row.team2_score,
    status: row.status,
    winner_id: row.winner_id,
  }));
}
