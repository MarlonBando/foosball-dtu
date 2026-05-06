import React, { useMemo } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import Spinner from '../../components/Spinner/Spinner';
import type {
  TournamentKnockoutMatch,
  TournamentKnockoutStage,
  TournamentStanding,
} from '../../api/types';
import {
  useTournamentKnockoutMatches,
  useTournamentStandings,
} from './tournamentHooks';
import {
  normalizeKnockoutStage,
  standingsSort,
  toStageLabel,
} from './tournamentUtils';

const GROUPS = ['A', 'B', 'C', 'D'] as const;
const STAGE_ORDER: TournamentKnockoutStage[] = ['r16', 'qf', 'sf', 'final'];

const TournamentPage: React.FC = () => {
  const {
    data: standings = [],
    isPending: isStandingsPending,
    error: standingsError,
  } = useTournamentStandings();
  const {
    data: knockoutMatches = [],
    isPending: isKnockoutPending,
    error: knockoutError,
  } = useTournamentKnockoutMatches();

  const standingsByGroup = useMemo(() => {
    const grouped = new Map<string, TournamentStanding[]>();
    GROUPS.forEach((group) => grouped.set(group, []));

    standings.forEach((row) => {
      const rows = grouped.get(row.group);
      if (rows) rows.push(row);
    });

    grouped.forEach((rows) => rows.sort(standingsSort));

    return grouped;
  }, [standings]);

  const knockoutByStage = useMemo(() => {
    const grouped = new Map<string, TournamentKnockoutMatch[]>();
    const stageOrder: string[] = [...STAGE_ORDER];
    STAGE_ORDER.forEach((stage) => grouped.set(stage, []));

    knockoutMatches.forEach((match) => {
      const stage = normalizeKnockoutStage(match.stage);
      const existing = grouped.get(stage);
      if (existing) {
        existing.push(match);
        return;
      }

      grouped.set(stage, [match]);
      stageOrder.push(stage);
    });

    grouped.forEach((matches) => matches.sort((a, b) => a.slot - b.slot));

    return { grouped, stageOrder };
  }, [knockoutMatches]);

  const isLoading = isStandingsPending || isKnockoutPending;
  const errorMessage = standingsError instanceof Error
    ? standingsError.message
    : knockoutError instanceof Error
      ? knockoutError.message
      : null;

  return (
    <PageLayout variant="full" backgroundColor="#ffffff">
      <div className="p-4 pb-24 text-left">
        <div className="bg-primary text-white p-8 rounded-b-3xl -mx-4 -mt-4 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>
          <div className="relative z-10">
            <div>
              <h1 className="text-2xl font-bold">Tournament</h1>
              <p className="text-white/80 mt-1">Group Stage and Knockout Bracket</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="large" />
            <p className="mt-4 text-gray-500 font-medium">Loading tournament data...</p>
          </div>
        ) : errorMessage ? (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {errorMessage}
          </div>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Group Stage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {GROUPS.map((group) => {
                  const rows = standingsByGroup.get(group) ?? [];
                  return (
                    <div key={group} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                        <h3 className="font-bold text-slate-700">Group {group}</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[360px] text-sm">
                          <thead>
                            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 bg-white">
                              <th className="px-4 py-3">Team</th>
                              <th className="px-3 py-3 text-right text-emerald-700">W</th>
                              <th className="px-3 py-3 text-right text-red-700">L</th>
                              <th className="px-3 py-3 text-right">GS</th>
                              <th className="px-3 py-3 text-right">GR</th>
                              <th className="px-3 py-3 text-right">GD</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                                  No teams found
                                </td>
                              </tr>
                            ) : (
                              rows.map((row) => {
                                const wins = row.wins ?? 0;
                                const losses = row.losses ?? 0;

                                return (
                                  <tr key={row.team_id} className="hover:bg-slate-50/80">
                                    <td className="px-4 py-3 font-medium text-slate-800">{row.team}</td>
                                    <td className="px-3 py-3 text-right font-bold text-emerald-700 bg-emerald-50/60">{wins}</td>
                                    <td className="px-3 py-3 text-right font-semibold text-red-700 bg-red-50/60">{losses}</td>
                                    <td className="px-3 py-3 text-right text-slate-700">{row.goals_for}</td>
                                    <td className="px-3 py-3 text-right text-slate-700">{row.goals_against}</td>
                                    <td className="px-3 py-3 text-right font-semibold text-slate-900">{row.goal_diff}</td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Knockout Bracket</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {knockoutByStage.stageOrder.map((stage) => {
                  const matches = knockoutByStage.grouped.get(stage) ?? [];
                  return (
                    <div key={stage} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                        <h3 className="font-bold text-slate-700">{toStageLabel(stage)}</h3>
                      </div>
                      <ul className="divide-y divide-slate-100">
                        {matches.length === 0 ? (
                          <li className="px-4 py-6 text-center text-slate-400">No match slots</li>
                        ) : (
                          matches.map((match) => {
                            const isCompleted = match.status === 'completed';
                            const t1Score = match.team1_score ?? 0;
                            const t2Score = match.team2_score ?? 0;
                            
                            const isT1Winner = isCompleted && t1Score > t2Score;
                            const isT2Winner = isCompleted && t2Score > t1Score;

                            const scoreText = isCompleted
                              ? `${t1Score} - ${t2Score}`
                              : 'vs';

                            return (
                              <li key={`${stage}-${match.slot}`} className="px-4 py-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                                  Slot {match.slot}
                                </p>
                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                  <span className={`truncate font-medium ${
                                    !isCompleted
                                      ? 'text-slate-800'
                                      : isT1Winner 
                                        ? 'text-emerald-600 font-bold' 
                                        : 'text-slate-400'
                                  }`}>
                                    {match.team1 ?? 'TBD'}
                                  </span>
                                  <span className="font-semibold text-slate-700">{scoreText}</span>
                                  <span className={`truncate text-right font-medium ${
                                    !isCompleted
                                      ? 'text-slate-800'
                                      : isT2Winner 
                                        ? 'text-emerald-600 font-bold' 
                                        : 'text-slate-400'
                                  }`}>
                                    {match.team2 ?? 'TBD'}
                                  </span>
                                </div>
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default TournamentPage;
