import React, { useState, useMemo } from 'react';
import type { MatchDetail } from '../../api';
import { PLAYER_STATUS } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useAllPlayers } from '../../hooks/useAllPlayers';
import { usePlayerMatches } from '../../hooks/usePlayerMatches';
import PageLayout from '../../components/PageLayout/PageLayout';
import MatchHistoryList from '../../components/MatchHistoryList/MatchHistoryList';
import Toast from '../../components/Toast/Toast';
import Spinner from '../../components/Spinner/Spinner';
import type { Player, Match } from '../../types';

function convertApiMatchToUiMatch(apiMatch: MatchDetail): Match {
    const players = apiMatch.players;
    const t1_gk = players.find(p => p.is_team1 && p.is_gk);
    const t1_st = players.find(p => p.is_team1 && !p.is_gk);
    const t2_gk = players.find(p => !p.is_team1 && p.is_gk);
    const t2_st = players.find(p => !p.is_team1 && !p.is_gk);

    const toPlayer = (p: typeof t1_gk): Player | null => {
        if (!p) return null;
        return {
            id: p.player_id,
            username: p.username,
            name: p.name,
            surname: p.surname,
            nationality: p.nationality,
            elo: p.current_elo,
            elo_change: p.elo_new - p.elo_old,
            wins: p.wins,
            losses: p.losses,
            created_at: apiMatch.created_at
        };
    };

    return {
        id: apiMatch.id,
        created_at: apiMatch.created_at,
        t1_gk: toPlayer(t1_gk),
        t1_st: toPlayer(t1_st),
        t2_gk: toPlayer(t2_gk),
        t2_st: toPlayer(t2_st),
        table: 1,
        t1_score: apiMatch.t1_score,
        t2_score: apiMatch.t2_score,
        status: apiMatch.status,
        t1_gk_status: t1_gk?.status || PLAYER_STATUS.PENDING,
        t1_st_status: t1_st?.status || PLAYER_STATUS.PENDING,
        t2_gk_status: t2_gk?.status || PLAYER_STATUS.PENDING,
        t2_st_status: t2_st?.status || PLAYER_STATUS.PENDING,
    };
}

const HomePage: React.FC = () => {
    const { playerId } = useAuth();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Use React Query hooks for data fetching
    const { data: players = [] } = useAllPlayers();
    const { data: matchDetails = [], isPending: loadingMatches } = usePlayerMatches(playerId);

    // Find current player from players list
    const player = useMemo(() => 
        players.find(p => p.id === playerId) || null, 
        [players, playerId]
    );

    // Convert API matches to UI matches
    const matches = useMemo(() => 
        matchDetails.map(convertApiMatchToUiMatch),
        [matchDetails]
    );

    // Filter to show only completed matches in history
    const completedMatches = useMemo(() => 
        matches.filter(m => m.status === 'completed'),
        [matches]
    );

    return (
        <PageLayout variant="full" backgroundColor="#ffffff">
            <div className="home-page p-4 pb-24">
                {!playerId ? (
                    <div className="text-center p-16">
                        <p className="text-gray-500">No player profile linked to your account.</p>
                    </div>
                ) : (
                    <>
                        {loadingMatches ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Spinner size="large" />
                                <p className="mt-4 text-gray-500 font-medium">Loading match history...</p>
                            </div>
                        ) : player ? (
                            <MatchHistoryList
                                matches={completedMatches}
                                currentPlayerId={player.id}
                            />
                        ) : (
                            <div className="text-center p-16">
                                <p className="text-gray-500">No player profile found.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </PageLayout>
    );
};

export default HomePage;
