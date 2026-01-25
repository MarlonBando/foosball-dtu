import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAllPlayers } from '../../hooks/useAllPlayers';
import { usePlayerMatches } from '../../hooks/usePlayerMatches';
import { useAcceptMatch, useRejectMatch } from '../../hooks/useMatchMutations';
import type { MatchDetail } from '../../api';
import { PLAYER_STATUS } from '../../types';
import PageLayout from '../../components/PageLayout/PageLayout';
import Spinner from '../../components/Spinner/Spinner';
import MatchHistoryList from '../../components/MatchHistoryList/MatchHistoryList';
import Toast from '../../components/Toast/Toast';
import type { Player, Match } from '../../types';
import { LogOut } from 'lucide-react';

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

const ProfilePage: React.FC = () => {
    const { playerId, signOut } = useAuth();
    const navigate = useNavigate();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Use React Query hooks for data fetching
    const { data: players = [], isPending: loadingPlayers } = useAllPlayers();
    const { data: matchDetails = [], isPending: loadingMatches } = usePlayerMatches(playerId);

    // Use mutations for accept/reject
    const acceptMutation = useAcceptMatch();
    const rejectMutation = useRejectMatch();

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

    // Filter pending matches
    const pendingMatches = useMemo(() => 
        matches.filter(match => match.status === 'pending'),
        [matches]
    );

    const handleAcceptMatch = (matchId: number) => {
        acceptMutation.mutate({ matchId }, {
            onSuccess: () => {
                setToast({ message: 'Match accepted successfully!', type: 'success' });
            },
            onError: (err) => {
                console.error('Failed to accept match:', err);
                setToast({ message: 'Failed to accept match. Please try again.', type: 'error' });
            },
        });
    };

    const handleRejectMatch = (matchId: number) => {
        rejectMutation.mutate({ matchId }, {
            onSuccess: () => {
                setToast({ message: 'Match rejected successfully!', type: 'success' });
            },
            onError: (err) => {
                console.error('Failed to reject match:', err);
                setToast({ message: 'Failed to reject match. Please try again.', type: 'error' });
            },
        });
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
            setToast({ message: 'Failed to logout. Please try again.', type: 'error' });
        }
    };

    if (!player) {
        return (
            <PageLayout variant="full" backgroundColor="#ffffff">
                <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                    {loadingPlayers ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Spinner size="large" />
                            <p className="mt-4 text-gray-500 font-medium">Loading profile...</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">Player profile not found.</p>
                    )}
                </div>
            </PageLayout>
        );
    }

    const winRate = (player.wins + player.losses) > 0
        ? Math.round((player.wins / (player.wins + player.losses)) * 100)
        : 0;

    return (
        <PageLayout variant="full" backgroundColor="#ffffff">
            <div className="p-4 pb-24">
                {/* Profile Header Banner - Red Background */}
                <div className="bg-primary text-white p-8 rounded-b-3xl -mx-4 -mt-4 mb-8 shadow-2xl relative overflow-hidden">
                    {/* Decorative blur elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                    <div className="max-w-md mx-auto relative">
                        {/* Logout Button - Top Right */}
                        <button
                            onClick={handleLogout}
                            className="absolute top-0 right-0 text-sm text-white hover:text-white/80 
                                       transition-colors flex items-center gap-1.5 font-medium z-10"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>

                        <div className="text-center mb-8 relative z-10">
                            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-primary shadow-lg">
                                {player.username.substring(0, 2).toUpperCase()}
                            </div>
                            <h1 className="text-2xl font-bold text-white">{player.name} {player.surname}</h1>
                            <p className="text-white/80">@{player.username}</p>
                        </div>

                        {/* Stats Cards Section - Inside Banner */}
                        <div className="relative z-10">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
                                <div className="relative z-10 text-center">
                                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Current ELO</h2>
                                    <div className="text-5xl font-black text-primary tracking-tight">
                                        {player.elo}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
                                    <div className="text-2xl font-bold text-gray-900">{player.wins}</div>
                                    <div className="text-xs font-semibold text-green-500 uppercase mt-1">Wins</div>
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
                                    <div className="text-2xl font-bold text-gray-900">{player.losses}</div>
                                    <div className="text-xs font-semibold text-red-500 uppercase mt-1">Losses</div>
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
                                    <div className="text-2xl font-bold text-gray-900">{winRate}%</div>
                                    <div className="text-xs font-semibold text-blue-500 uppercase mt-1">Win Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {(loadingMatches || pendingMatches.length > 0) && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 px-4">Pending Matches</h2>
                        {loadingMatches ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Spinner size="large" />
                                <p className="mt-4 text-gray-500 font-medium">Loading pending matches...</p>
                            </div>
                        ) : (
                            <MatchHistoryList
                                matches={pendingMatches}
                                currentPlayerId={player.id}
                                onAcceptMatch={handleAcceptMatch}
                                onRejectMatch={handleRejectMatch}
                                showPendingActions={true}
                                headerTitle="Pending Matches"
                                showHeader={false}
                            />
                        )}
                    </div>
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

export default ProfilePage;
