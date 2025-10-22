import React, { useState, useEffect } from 'react';
import { getPlayerMatches, acceptMatch, rejectMatch, getMatchDetails } from '../../api';
import type { MatchDetail } from '../../api';
import { PLAYER_STATUS } from '../../types';
import PageLayout from '../../components/PageLayout/PageLayout';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import MatchHistoryTable from '../../components/MatchHistoryTable/MatchHistoryTable';
import Toast from '../../components/Toast/Toast';
import Spinner from '../../components/Spinner/Spinner';
import './HomePage.css';
import type { Player, Match } from '../../types';

const CURRENT_PLAYER_ID = 1;

const mockPlayer: Player = {
    id: CURRENT_PLAYER_ID,
    created_at: new Date().toISOString(),
    username: 'johndoe',
    elo: 1450,
    name: 'John',
    surname: 'Doe',
    nationality: 1,
    wins: 24,
    losses: 18,
};

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
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        setLoading(true);
        getPlayerMatches(CURRENT_PLAYER_ID)
            .then(async (apiMatches) => {
                const detailedMatches = await Promise.all(
                    apiMatches.map(m => getMatchDetails(m.id))
                );
                setMatches(detailedMatches.map(convertApiMatchToUiMatch));
            })
            .catch(err => {
                console.error('Failed to load matches:', err);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAcceptMatch = (matchId: number) => {
        acceptMatch(matchId, CURRENT_PLAYER_ID)
            .then(() => {
                setMatches(prevMatches =>
                    prevMatches.map(match => {
                        if (match.id !== matchId) return match;
                        
                        const updatedMatch = { ...match };
                        if (match.t1_gk?.id === CURRENT_PLAYER_ID) updatedMatch.t1_gk_status = PLAYER_STATUS.ACCEPTED;
                        if (match.t1_st?.id === CURRENT_PLAYER_ID) updatedMatch.t1_st_status = PLAYER_STATUS.ACCEPTED;
                        if (match.t2_gk?.id === CURRENT_PLAYER_ID) updatedMatch.t2_gk_status = PLAYER_STATUS.ACCEPTED;
                        if (match.t2_st?.id === CURRENT_PLAYER_ID) updatedMatch.t2_st_status = PLAYER_STATUS.ACCEPTED;
                        
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
        rejectMatch(matchId, CURRENT_PLAYER_ID)
            .then(() => {
                setMatches(prevMatches =>
                    prevMatches.map(match => {
                        if (match.id !== matchId) return match;
                        
                        const updatedMatch = { ...match };
                        if (match.t1_gk?.id === CURRENT_PLAYER_ID) updatedMatch.t1_gk_status = PLAYER_STATUS.REJECTED;
                        if (match.t1_st?.id === CURRENT_PLAYER_ID) updatedMatch.t1_st_status = PLAYER_STATUS.REJECTED;
                        if (match.t2_gk?.id === CURRENT_PLAYER_ID) updatedMatch.t2_gk_status = PLAYER_STATUS.REJECTED;
                        if (match.t2_st?.id === CURRENT_PLAYER_ID) updatedMatch.t2_st_status = PLAYER_STATUS.REJECTED;
                        
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
                <PlayerHeader player={mockPlayer} />
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Spinner size="large" />
                        <p style={{ marginTop: '1rem', color: '#666' }}>Loading matches...</p>
                    </div>
                ) : (
                    <MatchHistoryTable
                        matches={matches}
                        currentPlayerId={mockPlayer.id}
                        onAcceptMatch={handleAcceptMatch}
                        onRejectMatch={handleRejectMatch}
                    />
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
