import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAllPlayers } from '../../hooks/useAllPlayers';
import PageLayout from '../../components/PageLayout/PageLayout';
import Spinner from '../../components/Spinner/Spinner';
import PlayerRankingCard from '../../components/PlayerRankingCard/PlayerRankingCard';
import { Trophy, Crown } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
    const { playerId } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    // Use React Query hook for data fetching
    const { data: playersData = [], isPending } = useAllPlayers();

    // Sort players by ELO descending
    const players = useMemo(() => 
        [...playersData].sort((a, b) => b.elo - a.elo),
        [playersData]
    );

    const top3 = useMemo(() => players.slice(0, 3), [players]);

    // Filter all players based on search query
    const filteredPlayers = useMemo(() => 
        searchQuery.trim() === ''
            ? players
            : players.filter(player => 
                player.username.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [players, searchQuery]
    );

    return (
        <PageLayout variant="full" backgroundColor="#ffffff">
            <div className="p-4 pb-24">
                {/* Podium Banner - Always Visible */}
                <div className="bg-primary text-white p-8 rounded-b-3xl -mx-4 -mt-4 mb-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                    <h1 className="text-2xl font-bold text-center mb-8 relative z-10 flex items-center justify-center gap-2">
                        <Trophy className="text-yellow-400" /> Leaderboard
                    </h1>

                    {/* Podium - Show structure with placeholders if loading */}
                    <div className="flex justify-center items-end gap-4 relative z-10 w-full max-w-sm mx-auto">
                        {isPending ? (
                            /* Empty podium structure with placeholders */
                            <>
                                {/* 2nd Place Placeholder */}
                                <div className="flex flex-col items-center w-20">
                                    <div className="w-16 h-16 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-500 relative mb-2 shadow-lg">
                                        ?
                                        <div className="absolute -bottom-2 bg-slate-300 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">#2</div>
                                    </div>
                                    <div className="flex flex-col items-start w-full px-1">
                                        <div className="text-xs font-semibold text-slate-400 mb-0.5 w-full truncate text-left">---</div>
                                        <div className="text-[10px] mb-1 font-medium text-slate-500">-W / -L</div>
                                    </div>
                                    <div className="bg-slate-700/50 rounded-t-lg w-20 h-24 flex items-center justify-center border-t border-l border-r border-slate-600">
                                        <span className="font-bold text-slate-500">---</span>
                                    </div>
                                </div>

                                {/* 1st Place Placeholder */}
                                <div className="flex flex-col items-center -mx-2 z-20 w-24">
                                    <Crown className="text-yellow-400 mb-1" size={20} />
                                    <div className="w-20 h-20 rounded-full border-4 border-yellow-400 bg-yellow-900/50 flex items-center justify-center text-2xl font-bold text-yellow-600 relative mb-2 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                                        ?
                                        <div className="absolute -bottom-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">#1</div>
                                    </div>
                                    <div className="flex flex-col items-start w-full px-1">
                                        <div className="text-sm font-bold text-yellow-600 mb-0.5 w-full truncate text-left">---</div>
                                        <div className="text-xs mb-1 font-medium text-yellow-700">-W / -L</div>
                                    </div>
                                    <div className="bg-gradient-to-b from-yellow-500/20 to-yellow-900/20 backdrop-blur-sm rounded-t-xl w-24 h-32 flex items-center justify-center border-t border-l border-r border-yellow-500/30">
                                        <span className="font-black text-xl text-yellow-600">---</span>
                                    </div>
                                </div>

                                {/* 3rd Place Placeholder */}
                                <div className="flex flex-col items-center w-20">
                                    <div className="w-16 h-16 rounded-full border-2 border-amber-700 bg-amber-900/50 flex items-center justify-center text-xl font-bold text-amber-800 relative mb-2 shadow-lg">
                                        ?
                                        <div className="absolute -bottom-2 bg-amber-700 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full">#3</div>
                                    </div>
                                    <div className="flex flex-col items-start w-full px-1">
                                        <div className="text-xs font-semibold text-amber-800 mb-0.5 w-full truncate text-left">---</div>
                                        <div className="text-[10px] mb-1 font-medium text-amber-900/50">-W / -L</div>
                                    </div>
                                    <div className="bg-amber-900/30 rounded-t-lg w-20 h-16 flex items-center justify-center border-t border-l border-r border-amber-800/50">
                                        <span className="font-bold text-amber-800">---</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Actual podium with data */
                            <>
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
                            </>
                        )}
                    </div>
                </div>

                {/* Search Bar - Always Visible */}
                <div className="mb-6 max-w-4xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-200 
                                       focus:outline-none focus:ring-2 focus:ring-primary/50 
                                       focus:border-primary transition-all
                                       bg-white shadow-sm text-gray-900 placeholder-gray-400"
                        />
                        <svg 
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                            />
                        </svg>
                    </div>
                    {searchQuery && !isPending && (
                        <p className="text-sm text-gray-500 mt-2">
                            Found {filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Player List - Show spinner if loading, otherwise show list */}
                {isPending ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Spinner size="large" />
                        <p className="mt-4 text-gray-500 font-medium">Loading players...</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-w-4xl mx-auto">
                        {filteredPlayers.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No players found</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Try searching for a different username
                                </p>
                            </div>
                        ) : (
                            filteredPlayers.map((player) => {
                                const isCurrentUser = player.id === playerId;
                                const rank = players.findIndex(p => p.id === player.id) + 1;
                                return (
                                    <PlayerRankingCard
                                        key={player.id}
                                        player={player}
                                        rank={rank}
                                        isCurrentUser={isCurrentUser}
                                        showRank={true}
                                        showWinLoss={true}
                                    />
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default LeaderboardPage;
