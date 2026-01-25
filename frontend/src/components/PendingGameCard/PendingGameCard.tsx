import React from 'react';
import type { Match } from '../../types';

interface PendingGameCardProps {
    match: Match;
    currentUserId: number;
    onAccept: (matchId: number) => void;
    onReject: (matchId: number) => void;
}

const PendingGameCard: React.FC<PendingGameCardProps> = ({ match, onAccept, onReject }) => {
    // Helper to format player names or "Open Slot"
    const renderPlayer = (player: any) => { // Using any temporarily as types might need mapped from Match to PlayerInMatch if not consistent, but Match has t1_gk: Player
        if (!player) return <span className="text-gray-400 italic">Open</span>;
        return <span className="font-semibold text-gray-800">{player.username}</span>;
    };

    // Helper to get status of the current user in this match to show context if needed
    // But for now we just show the match details.

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-3 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Pending Match</span>
                    <span className="text-xs text-gray-400">{new Date(match.created_at || '').toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <div className="flex-1 text-right">
                        <div className="block">{renderPlayer(match.t1_gk)} (GK)</div>
                        <div className="block">{renderPlayer(match.t1_st)} (ST)</div>
                    </div>
                    <div className="font-black text-gray-300 px-2">VS</div>
                    <div className="flex-1 text-left">
                        <div className="block">{renderPlayer(match.t2_gk)} (GK)</div>
                        <div className="block">{renderPlayer(match.t2_st)} (ST)</div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                    onClick={() => match.id && onAccept(match.id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Accept
                </button>
                <button
                    onClick={() => match.id && onReject(match.id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-red-50 to-red-600 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Reject
                </button>
            </div>
        </div>
    );
};

export default PendingGameCard;
