import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllPlayers } from '../../api';
import PageLayout from '../../components/PageLayout/PageLayout';
import Spinner from '../../components/Spinner/Spinner';
import type { Player } from '../../types';

const ProfilePage: React.FC = () => {
    const { playerId } = useAuth();
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!playerId) {
            setLoading(false);
            return;
        }

        getAllPlayers()
            .then(players => {
                const found = players.find(p => p.id === playerId);
                if (found) setPlayer(found);
            })
            .catch(err => console.error('Failed to fetch player:', err))
            .finally(() => setLoading(false));
    }, [playerId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Spinner size="large" />
            </div>
        );
    }

    if (!player) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                <p className="text-gray-500">Player profile not found.</p>
            </div>
        );
    }

    const winRate = (player.wins + player.losses) > 0
        ? Math.round((player.wins / (player.wins + player.losses)) * 100)
        : 0;

    return (
        <PageLayout variant="full">
            <div className="p-6 pb-24 max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-light rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        {player.username.substring(0, 2).toUpperCase()}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{player.name} {player.surname}</h1>
                    <p className="text-gray-500">@{player.username}</p>
                </div>

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
        </PageLayout>
    );
};

export default ProfilePage;
