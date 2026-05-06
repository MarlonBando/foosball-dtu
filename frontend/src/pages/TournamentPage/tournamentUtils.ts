import type {
  TournamentKnockoutStage,
  TournamentStanding,
} from '../../api/types';

export const STAGE_LABELS: Record<TournamentKnockoutStage, string> = {
  r16: 'Round of 16',
  qf: 'Quarter Finals',
  sf: 'Semi Finals',
  final: 'Final',
};

export const standingsSort = (a: TournamentStanding, b: TournamentStanding) => {
  const aWins = a.wins ?? 0;
  const bWins = b.wins ?? 0;
  if (bWins !== aWins) return bWins - aWins;
  if (b.goal_diff !== a.goal_diff) return b.goal_diff - a.goal_diff;
  if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;
  return a.team.localeCompare(b.team);
};

export const normalizeKnockoutStage = (stage: string): string => {
  const normalized = stage.toLowerCase().trim().replaceAll('-', '_').replaceAll(' ', '_');
  const compacted = normalized.replaceAll('_', '').replaceAll('/', '');

  switch (compacted) {
    case 'r16':
    case 'ro16':
    case 'round16':
    case 'roundof16':
    case '18':
      return 'r16';
    case 'qf':
    case 'quarterfinal':
    case 'quarterfinals':
    case 'quarteroffinal':
    case '14':
      return 'qf';
    case 'sf':
    case 'semifinal':
    case 'semifinals':
    case 'semioffinal':
    case '12':
      return 'sf';
    case 'f':
    case 'final':
    case 'finals':
      return 'final';
    default:
      return normalized || 'unknown';
  }
};

export const toStageLabel = (stage: string): string => {
  if (stage in STAGE_LABELS) {
    return STAGE_LABELS[stage as TournamentKnockoutStage];
  }

  return stage
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
