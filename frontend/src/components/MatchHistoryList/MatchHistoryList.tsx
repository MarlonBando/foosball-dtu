import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Match } from '../../types';

interface MatchHistoryListProps {
  matches: Match[];
  currentPlayerId?: number;
  onAcceptMatch?: (matchId: number) => void;
  onRejectMatch?: (matchId: number) => void;
  showPendingActions?: boolean;
  headerTitle?: string;
  showHeader?: boolean;
}

const MatchHistoryList: React.FC<MatchHistoryListProps> = ({
  matches,
  currentPlayerId,
  onAcceptMatch,
  onRejectMatch,
  showPendingActions = false,
  headerTitle = "Match History",
  showHeader = true
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOpponentName = (match: Match) => {
    if (!currentPlayerId) return 'Opponent';

    // Check which team current player is on
    const isTeam1 = match.t1_gk?.id === currentPlayerId || match.t1_st?.id === currentPlayerId;

    // Return the other team's players
    if (isTeam1) {
      if (match.t2_gk && match.t2_st) return `vs ${match.t2_gk.username} & ${match.t2_st.username}`;
      return `vs ${match.t2_gk?.username || match.t2_st?.username || 'Unknown'}`;
    } else {
      if (match.t1_gk && match.t1_st) return `vs ${match.t1_gk.username} & ${match.t1_st.username}`;
      return `vs ${match.t1_gk?.username || match.t1_st?.username || 'Unknown'}`;
    }
  };

  const getMatchResult = (match: Match) => {
    if (match.status !== 'completed' || !currentPlayerId) return null;
    const isTeam1 = match.t1_gk?.id === currentPlayerId || match.t1_st?.id === currentPlayerId;
    const team1Won = match.t1_score > match.t2_score;
    return isTeam1 ? team1Won : !team1Won;
  };

  const getEloChange = (match: Match) => {
    if (!currentPlayerId) return null;
    // Find the player object for the current user
    if (match.t1_gk?.id === currentPlayerId) return match.t1_gk.elo_change;
    if (match.t1_st?.id === currentPlayerId) return match.t1_st.elo_change;
    if (match.t2_gk?.id === currentPlayerId) return match.t2_gk.elo_change;
    if (match.t2_st?.id === currentPlayerId) return match.t2_st.elo_change;
    return null;
  };

  const currentPlayerNeedsToRespond = (match: Match): boolean => {
    if (!currentPlayerId || !showPendingActions) return false;
    if (match.status !== 'pending') return false;

    if (match.t1_gk?.id === currentPlayerId && match.t1_gk_status === 'pending') return true;
    if (match.t1_st?.id === currentPlayerId && match.t1_st_status === 'pending') return true;
    if (match.t2_gk?.id === currentPlayerId && match.t2_gk_status === 'pending') return true;
    if (match.t2_st?.id === currentPlayerId && match.t2_st_status === 'pending') return true;

    return false;
  };

  const getCurrentPlayerStatus = (match: Match): string => {
    if (!currentPlayerId) return 'pending';

    if (match.t1_gk?.id === currentPlayerId) return match.t1_gk_status;
    if (match.t1_st?.id === currentPlayerId) return match.t1_st_status;
    if (match.t2_gk?.id === currentPlayerId) return match.t2_gk_status;
    if (match.t2_st?.id === currentPlayerId) return match.t2_st_status;

    return 'pending';
  };

  return (
    <div className="w-full space-y-3 pb-4">
      {showHeader && (
        <div className="bg-primary text-white p-6 -mx-4 -mt-4 mb-6 relative overflow-hidden">
          <h2 className="text-2xl font-bold relative z-10">{headerTitle}</h2>
          <p className="text-white/80 relative z-10">{matches.length} {showPendingActions ? 'pending matches' : 'matches played'}</p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>
        </div>
      )}

      {matches.length === 0 && showPendingActions && (
        <div className="text-center py-8 text-gray-500">
          No pending matches
        </div>
      )}

      {matches.map((match) => {
        const result = getMatchResult(match);
        const won = result === true;
        const loss = result === false;
        // If pending or no result yet
        const isPending = result === null;

        const eloChange = getEloChange(match);
        const eloChangeText = eloChange ? (eloChange > 0 ? `+${eloChange} ELO` : `${eloChange} ELO`) : '';

        return (
          <div
            key={match.id}
            onClick={() => navigate(`/match/${match.id}`, { state: { readOnly: true } })}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-transform duration-200"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold 
                ${won ? 'bg-green-100 text-green-600' : ''} 
                ${loss ? 'bg-red-100 text-red-600' : ''}
                ${isPending ? 'bg-gray-100 text-gray-500' : ''}
              `}>
                {won && 'W'}
                {loss && 'L'}
                {isPending && '⏳'}
              </div>

              <div className="flex flex-col">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">
                    {getOpponentName(match)}
                  </h3>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium text-left">
                    {formatDate(match.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right flex items-center justify-end">
              {isPending && currentPlayerNeedsToRespond(match) && onAcceptMatch && onRejectMatch ? (
                // Show Accept/Reject buttons when player needs to respond
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (match.id) onAcceptMatch(match.id);
                    }}
                    className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors active:scale-95"
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (match.id) onRejectMatch(match.id);
                    }}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors active:scale-95"
                  >
                    Reject
                  </button>
                </div>
              ) : isPending && showPendingActions ? (
                // Show status badge when player has already responded
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  getCurrentPlayerStatus(match) === 'accepted' 
                    ? 'bg-green-100 text-green-700' 
                    : getCurrentPlayerStatus(match) === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getCurrentPlayerStatus(match) === 'accepted' && '✓ Accepted'}
                  {getCurrentPlayerStatus(match) === 'rejected' && '✕ Rejected'}
                  {getCurrentPlayerStatus(match) === 'pending' && 'Pending'}
                </span>
              ) : isPending ? (
                // Default pending badge (for history page - shouldn't show since we filter)
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  Pending
                </span>
              ) : (
                // Completed match - show score and ELO change
                <div className="flex flex-col items-end gap-0.5">
                  <div className="text-lg font-bold text-gray-900">
                    {match.t1_score} - {match.t2_score}
                  </div>
                  {eloChange !== undefined && eloChange !== null && (
                    <div className={`text-xs font-bold ${eloChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {eloChange > 0 && <span className="mr-0.5">↗</span>}
                      {eloChange < 0 && <span className="mr-0.5">↘</span>}
                      {eloChangeText}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchHistoryList;
