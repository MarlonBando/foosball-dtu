import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MatchHistoryTable.css';
import Spinner from '../Spinner/Spinner';
import type { Match } from '../../types';

interface MatchHistoryTableProps {
    matches: Match[];
    currentPlayerId?: number;
    onAcceptMatch?: (matchId: number) => void;
    onRejectMatch?: (matchId: number) => void;
}

const MatchHistoryTable: React.FC<MatchHistoryTableProps> = ({
    matches,
    currentPlayerId,
    onAcceptMatch,
    onRejectMatch
}) => {
    const navigate = useNavigate();
    const [loadingMatchId, setLoadingMatchId] = useState<number | null>(null);
    const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);

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

    const getCurrentPlayerStatus = (match: Match, playerId: number): 'pending' | 'accepted' | 'rejected' | null => {
        if (match.t1_gk?.id === playerId) return match.t1_gk_status;
        if (match.t1_st?.id === playerId) return match.t1_st_status;
        if (match.t2_gk?.id === playerId) return match.t2_gk_status;
        if (match.t2_st?.id === playerId) return match.t2_st_status;
        return null;
    };

    const getMatchResult = (match: Match) => {
        if (match.status !== 'completed' || !currentPlayerId) return null;

        const isTeam1 = match.t1_gk?.id === currentPlayerId || match.t1_st?.id === currentPlayerId;
        const team1Won = match.t1_score > match.t2_score;

        return isTeam1 ? team1Won : !team1Won;
    };

    const renderStatus = (match: Match) => {
        // Check if current player is in this match and their status is pending
        const playerStatus = currentPlayerId ? getCurrentPlayerStatus(match, currentPlayerId) : null;
        const isLoading = loadingMatchId === match.id;
        
        if (playerStatus === 'pending') {
            // Current player needs to accept/reject
            return (
                <div className="action-buttons-group">
                    <button
                        className="accept-button-table"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (match.id && onAcceptMatch) {
                                setLoadingMatchId(match.id);
                                setActionType('accept');
                                onAcceptMatch(match.id);
                                setTimeout(() => {
                                    setLoadingMatchId(null);
                                    setActionType(null);
                                }, 1000);
                            }
                        }}
                        disabled={isLoading}
                    >
                        {isLoading && actionType === 'accept' ? (
                            <Spinner size="small" color="white" />
                        ) : (
                            '✓ Accept'
                        )}
                    </button>
                    <button
                        className="reject-button-table"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (match.id && onRejectMatch) {
                                setLoadingMatchId(match.id);
                                setActionType('reject');
                                onRejectMatch(match.id);
                                setTimeout(() => {
                                    setLoadingMatchId(null);
                                    setActionType(null);
                                }, 1000);
                            }
                        }}
                        disabled={isLoading}
                    >
                        {isLoading && actionType === 'reject' ? (
                            <Spinner size="small" color="white" />
                        ) : (
                            '✕ Reject'
                        )}
                    </button>
                </div>
            );
        }
        
        // Player has already acted or isn't in match - show match status
        if (match.status === 'completed') {
            const won = getMatchResult(match);
            return (
                <span className={`status-badge ${won ? 'status-win' : 'status-loss'}`}>
                    {won ? '✓' : '✗'}
                </span>
            );
        } else if (match.status === 'rejected') {
            return (
                <span className="status-badge status-rejected">
                    ✕
                </span>
            );
        } else {
            // Match is still pending
            return (
                <span className="status-badge status-pending">
                    ⏳
                </span>
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