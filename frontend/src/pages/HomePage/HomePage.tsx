import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlayerMatches, acceptMatch, rejectMatch, getMatchDetails, getAllPlayers } from '../../api';
import type { MatchDetail } from '../../api';
import { PLAYER_STATUS } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from '../../components/PageLayout/PageLayout';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import MatchHistoryTable from '../../components/MatchHistoryTable/MatchHistoryTable';
import Toast from '../../components/Toast/Toast';
import Spinner from '../../components/Spinner/Spinner';
import './HomePage.css';
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
    const navigate = useNavigate();
    const [player, setPlayer] = useState<Player | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        if (!playerId) {
            setLoading(false);
            setToast({ message: 'No player profile linked to your account.', type: 'error' });
            return;
        }

        setLoading(true);
        
        // Fetch player data and matches
        Promise.all([
            getAllPlayers().then(players => players.find(p => p.id === playerId)),
            getPlayerMatches(playerId)
        ])
            .then(async ([currentPlayer, apiMatches]) => {
                if (!currentPlayer) {
                    throw new Error('Player not found');
                }
                
                setPlayer(currentPlayer);
                
                const detailedMatches = await Promise.all(
                    apiMatches.map(m => getMatchDetails(m.id))
                );
                setMatches(detailedMatches.map(convertApiMatchToUiMatch));
            })
            .catch(err => {
                console.error('Failed to load player data:', err);
                setToast({ message: 'Failed to load player data. Please try again.', type: 'error' });
            })
            .finally(() => setLoading(false));
    }, [playerId]);

    const handleAcceptMatch = (matchId: number) => {
        if (!player) return;
        
        acceptMatch(matchId, player.id)
            .then(() => {
                setMatches(prevMatches =>
                    prevMatches.map(match => {
                        if (match.id !== matchId) return match;
                        
                        const updatedMatch = { ...match };
                        if (match.t1_gk?.id === player.id) updatedMatch.t1_gk_status = PLAYER_STATUS.ACCEPTED;
                        if (match.t1_st?.id === player.id) updatedMatch.t1_st_status = PLAYER_STATUS.ACCEPTED;
                        if (match.t2_gk?.id === player.id) updatedMatch.t2_gk_status = PLAYER_STATUS.ACCEPTED;
                        if (match.t2_st?.id === player.id) updatedMatch.t2_st_status = PLAYER_STATUS.ACCEPTED;
                        
                        return updatedMatch;
                    })
                );
                setToast({ message: 'Match accepted successfully!', type: 'success' });
            })
            .catch(err => {
                console.error('Failed to accept match:', err);
                setToast({ message: 'Failed to accept match. Please try again.', type: 'error' });
            });
    };

    const handleRejectMatch = (matchId: number) => {
        if (!player) return;
        
        rejectMatch(matchId, player.id)
            .then(() => {
                setMatches(prevMatches =>
                    prevMatches.map(match => {
                        if (match.id !== matchId) return match;
                        
                        const updatedMatch = { ...match };
                        if (match.t1_gk?.id === player.id) updatedMatch.t1_gk_status = PLAYER_STATUS.REJECTED;
                        if (match.t1_st?.id === player.id) updatedMatch.t1_st_status = PLAYER_STATUS.REJECTED;
                        if (match.t2_gk?.id === player.id) updatedMatch.t2_gk_status = PLAYER_STATUS.REJECTED;
                        if (match.t2_st?.id === player.id) updatedMatch.t2_st_status = PLAYER_STATUS.REJECTED;
                        
                        return updatedMatch;
                    })
                );
                setToast({ message: 'Match rejected successfully!', type: 'success' });
            })
            .catch(err => {
                console.error('Failed to reject match:', err);
                setToast({ message: 'Failed to reject match. Please try again.', type: 'error' });
            });
    };

    return (
        <PageLayout variant="full" backgroundColor="#ffffff">
            <div className="home-page">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Spinner size="large" />
                        <p style={{ marginTop: '1rem', color: '#666' }}>Loading your profile...</p>
                    </div>
                ) : player ? (
                    <>
                        <PlayerHeader player={player} />
                        <div className="home-actions">
                            <button 
                                className="create-match-button"
                                onClick={() => navigate('/match')}
                            >
                                + Create New Match
                            </button>
                        </div>
                        <MatchHistoryTable
                            matches={matches}
                            currentPlayerId={player.id}
                            onAcceptMatch={handleAcceptMatch}
                            onRejectMatch={handleRejectMatch}
                        />
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <p style={{ color: '#666' }}>No player profile found. Please contact an administrator.</p>
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

export default HomePage;
