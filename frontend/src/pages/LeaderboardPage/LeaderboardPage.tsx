import React, { useState, useEffect } from 'react';
import { getAllPlayers } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/PageLayout/PageLayout';
import Spinner from '../../components/Spinner/Spinner';
import type { Player } from '../../types';
import { Trophy, Crown } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
    const { playerId } = useAuth();
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllPlayers()
            .then(data => {
                // Sort by ELO descending
                const sorted = [...data].sort((a, b) => b.elo - a.elo);
                setPlayers(sorted);
            })
            .catch(err => console.error('Failed to fetch players:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Spinner size="large" />
            </div>
        );
    }

    const top3 = players.slice(0, 3);
    const rest = players.slice(3);

    return (
        <PageLayout variant="full">
            <div className="p-4 pb-24 max-w-lg mx-auto">
                <div className="bg-gradient-to-br from-primary-hover via-primary to-slate-900 text-white p-8 rounded-b-3xl -mx-4 -mt-4 mb-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                    <h1 className="text-2xl font-bold text-center mb-8 relative z-10 flex items-center justify-center gap-2">
                        <Trophy className="text-yellow-400" /> Leaderboard
                    </h1>

                    {/* Podium */}
                    <div className="flex justify-center items-end gap-4 relative z-10 w-full max-w-sm mx-auto">
                        {/* 2nd Place */}
                        {top3[1] && (
                            <div className="flex flex-col items-center w-20">
                                <div className="w-16 h-16 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-300 relative mb-2 shadow-lg">
                                    {top3[1].username.substring(0, 2).toUpperCase()}
                                    <div className="absolute -bottom-2 bg-slate-300 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">#2</div>
                                </div>
                                <div className="flex flex-col items-start w-full px-1">
                                    <div className="text-xs font-semibold text-slate-300 mb-0.5 w-full truncate text-left">{top3[1].username}</div>
                                    <div className="text-[10px] mb-1 font-medium whitespace-nowrap flex items-center">
                                        <span className="text-green-400">{top3[1].wins}W</span>
                                        <span className="mx-1 text-slate-500">/</span>
                                        <span className="text-red-400">{top3[1].losses}L</span>
                                    </div>
                                </div>
                                <div className="bg-slate-700/50 rounded-t-lg w-20 h-24 flex items-center justify-center border-t border-l border-r border-slate-600">
                                    <span className="font-bold text-slate-300">{top3[1].elo}</span>
                                </div>
                            </div>
                        )}

                        {/* 1st Place */}
                        {top3[0] && (
                            <div className="flex flex-col items-center -mx-2 z-20 w-24">
                                <Crown className="text-yellow-400 mb-1 animate-bounce" size={20} />
                                <div className="w-20 h-20 rounded-full border-4 border-yellow-400 bg-yellow-900/50 flex items-center justify-center text-2xl font-bold text-yellow-400 relative mb-2 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                                    {top3[0].username.substring(0, 2).toUpperCase()}
                                    <div className="absolute -bottom-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">#1</div>
                                </div>
                                <div className="flex flex-col items-start w-full px-1">
                                    <div className="text-sm font-bold text-yellow-400 mb-0.5 w-full truncate text-left">{top3[0].username}</div>
                                    <div className="text-xs mb-1 font-medium whitespace-nowrap flex items-center">
                                        <span className="text-green-400">{top3[0].wins}W</span>
                                        <span className="mx-1 text-yellow-500/50">/</span>
                                        <span className="text-red-400">{top3[0].losses}L</span>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-b from-yellow-500/20 to-yellow-900/20 backdrop-blur-sm rounded-t-xl w-24 h-32 flex items-center justify-center border-t border-l border-r border-yellow-500/30">
                                    <span className="font-black text-xl text-white">{top3[0].elo}</span>
                                </div>
                            </div>
                        )}

                        {/* 3rd Place */}
                        {top3[2] && (
                            <div className="flex flex-col items-center w-20">
                                <div className="w-16 h-16 rounded-full border-2 border-amber-700 bg-amber-900/50 flex items-center justify-center text-xl font-bold text-amber-600 relative mb-2 shadow-lg">
                                    {top3[2].username.substring(0, 2).toUpperCase()}
                                    <div className="absolute -bottom-2 bg-amber-700 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full">#3</div>
                                </div>
                                <div className="flex flex-col items-start w-full px-1">
                                    <div className="text-xs font-semibold text-amber-600 mb-0.5 w-full truncate text-left">{top3[2].username}</div>
                                    <div className="text-[10px] mb-1 font-medium whitespace-nowrap flex items-center">
                                        <span className="text-green-500">{top3[2].wins}W</span>
                                        <span className="mx-1 text-amber-900/30">/</span>
                                        <span className="text-red-500">{top3[2].losses}L</span>
                                    </div>
                                </div>
                                <div className="bg-amber-900/30 rounded-t-lg w-20 h-16 flex items-center justify-center border-t border-l border-r border-amber-800/50">
                                    <span className="font-bold text-amber-600">{top3[2].elo}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    {rest.map((player, index) => {
                        const isCurrentUser = player.id === playerId;
                        const rank = index + 4;
                        return (
                            <div
                                key={player.id}
                                className={`bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border transition-all gap-4
                                    ${isCurrentUser ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20' : 'border-slate-100'}
                                `}
                            >
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-gray-400">
                                        #{rank}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`font-bold truncate ${isCurrentUser ? 'text-primary' : 'text-gray-900'}`}>
                                                {player.username}
                                            </h3>
                                            {isCurrentUser && (
                                                <span className="flex-shrink-0 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium flex items-center">
                                            <span className="text-green-600">{player.wins}W</span>
                                            <span className="mx-1 text-slate-300">/</span>
                                            <span className="text-red-600">{player.losses}L</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 inline-flex items-center justify-center px-3 py-1 rounded-full font-bold text-sm bg-primary/10 text-primary">
                                    {player.elo}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PageLayout>
    );
};

export default LeaderboardPage;
