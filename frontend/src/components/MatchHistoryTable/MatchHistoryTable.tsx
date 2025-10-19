import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MatchHistoryTable.css';
import type { Match } from '../../types';

interface MatchHistoryTableProps {
    matches: Match[];
    currentPlayerId?: number;
    onAcceptMatch?: (matchId: number) => void;
}

const MatchHistoryTable: React.FC<MatchHistoryTableProps> = ({
    matches,
    currentPlayerId,
    onAcceptMatch
}) => {
    const navigate = useNavigate();

    const handleRowClick = (matchId: number | null) => {
        if (matchId) {
            navigate(`/match/${matchId}`, { state: { readOnly: true } });
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPlayers = (match: Match) => {
        const team1 = `${match.t1_gk?.username || 'TBD'}(GK) - ${match.t1_st?.username || 'TBD'}(ST)`;
        const team2 = `${match.t2_gk?.username || 'TBD'}(GK) - ${match.t2_st?.username || 'TBD'}(ST)`;
        return `${team1} vs ${team2}`;
    };

    const getMatchResult = (match: Match) => {
        if (match.status !== 'completed' || !currentPlayerId) return null;

        const isTeam1 = match.t1_gk?.id === currentPlayerId || match.t1_st?.id === currentPlayerId;
        const team1Won = match.t1_score > match.t2_score;

        return isTeam1 ? team1Won : !team1Won;
    };

    const renderStatus = (match: Match) => {
        if (match.status === 'completed') {
            const won = getMatchResult(match);
            return (
                <span className={`status-badge ${won ? 'status-win' : 'status-loss'}`}>
                    {won ? '✓' : '✗'}
                </span>
            );
        } else if (match.status === 'accepted') {
            return (
                <span className="status-badge status-pending">
                    ⏰
                </span>
            );
        } else {
            // pending - needs acceptance
            return (
                <button
                    className="accept-button"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from firing
                        onAcceptMatch && match.id && onAcceptMatch(match.id)
                    }}
                >
                    Accept
                </button>
            );
        }
    };

    return (
        <div className="match-history-container">
            <h2 className="match-history-title">Match History</h2>
            <div className="table-wrapper">
                <table className="match-history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Players</th>
                            <th>Score</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="no-matches">
                                    No matches found
                                </td>
                            </tr>
                        ) : (
                            matches.map((match, index) => (
                                <tr key={match.id || index} className="clickable-row" onClick={() => handleRowClick(match.id)}>
                                    <td className="date-cell">{formatDate(match.created_at)}</td>
                                    <td className="players-cell">{formatPlayers(match)}</td>
                                    <td className="score-cell">
                                        {match.status === 'completed'
                                            ? `${match.t1_score} - ${match.t2_score}`
                                            : '-'
                                        }
                                    </td>
                                    <td className="status-cell">{renderStatus(match)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MatchHistoryTable;