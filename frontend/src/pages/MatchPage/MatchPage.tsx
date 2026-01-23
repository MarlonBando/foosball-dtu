import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useMatchDetails } from '../../hooks/useMatchDetails';
import { useRegisterMatch } from '../../hooks/useMatchMutations';
import { acceptMatch as acceptMatchApi, rejectMatch as rejectMatchApi } from '../../api';
import type { RegisterMatchRequest, MatchDetail as ApiMatchDetail } from '../../api';
import { MATCH_STATUS, PLAYER_STATUS } from '../../types';
import FoosballTable from '../../components/FoosballTable/FoosballTable';
import Player from '../../components/Player/Player';
import Scoreboard from '../../components/Scoreboard/Scoreboard';
import PlayerSelectionModal from '../../components/PlayerSelectionModal/PlayerSelectionModal';
import PageLayout from '../../components/PageLayout/PageLayout';
import Toast from '../../components/Toast/Toast';
import Spinner from '../../components/Spinner/Spinner';
import './MatchPage.css';
import type { Match, Player as PlayerType } from '../../types';

type PlayerSlot = 't1_gk' | 't1_st' | 't2_gk' | 't2_st';

const initialMatch: Match = {
  id: null,
  created_at: null,
  t1_gk: null,
  t1_st: null,
  t2_gk: null,
  t2_st: null,
  table: 1,
  t1_score: 0,
  t2_score: 0,
  status: MATCH_STATUS.PENDING,
  t1_gk_status: PLAYER_STATUS.PENDING,
  t1_st_status: PLAYER_STATUS.PENDING,
  t2_gk_status: PLAYER_STATUS.PENDING,
  t2_st_status: PLAYER_STATUS.PENDING,
};

const currentUserId = 2;

function convertApiMatchToUiMatch(apiMatch: ApiMatchDetail): Match {
  const players = apiMatch.players;
  const t1_gk = players.find(p => p.is_team1 && p.is_gk);
  const t1_st = players.find(p => p.is_team1 && !p.is_gk);
  const t2_gk = players.find(p => !p.is_team1 && p.is_gk);
  const t2_st = players.find(p => !p.is_team1 && !p.is_gk);

  return {
    id: apiMatch.id,
    created_at: apiMatch.created_at,
    t1_gk: t1_gk ? {
      id: t1_gk.player_id,
      username: t1_gk.username,
      name: t1_gk.name,
      surname: t1_gk.surname,
      nationality: t1_gk.nationality,
      elo: t1_gk.current_elo,
      wins: t1_gk.wins,
      losses: t1_gk.losses,
      created_at: apiMatch.created_at
    } : null,
    t1_st: t1_st ? {
      id: t1_st.player_id,
      username: t1_st.username,
      name: t1_st.name,
      surname: t1_st.surname,
      nationality: t1_st.nationality,
      elo: t1_st.current_elo,
      wins: t1_st.wins,
      losses: t1_st.losses,
      created_at: apiMatch.created_at
    } : null,
    t2_gk: t2_gk ? {
      id: t2_gk.player_id,
      username: t2_gk.username,
      name: t2_gk.name,
      surname: t2_gk.surname,
      nationality: t2_gk.nationality,
      elo: t2_gk.current_elo,
      wins: t2_gk.wins,
      losses: t2_gk.losses,
      created_at: apiMatch.created_at
    } : null,
    t2_st: t2_st ? {
      id: t2_st.player_id,
      username: t2_st.username,
      name: t2_st.name,
      surname: t2_st.surname,
      nationality: t2_st.nationality,
      elo: t2_st.current_elo,
      wins: t2_st.wins,
      losses: t2_st.losses,
      created_at: apiMatch.created_at
    } : null,
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

const MatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const readOnly = location.state?.readOnly || false;

  const [match, setMatch] = useState<Match>(initialMatch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<PlayerSlot | null>(null);
  const [registering, setRegistering] = useState(false);
  const [loadingSlot, setLoadingSlot] = useState<PlayerSlot | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Use React Query hook for existing match
  const matchId = id ? parseInt(id) : null;
  const { data: matchData, isPending: loading } = useMatchDetails(matchId);

  // Use mutation hook for registering new match
  const registerMutation = useRegisterMatch();

  useEffect(() => {
    if (matchData) {
      setMatch(convertApiMatchToUiMatch(matchData));
    } else if (!id) {
      setMatch(initialMatch);
    }
  }, [matchData, id]);

  const handleScoreChange = (team: 't1' | 't2', delta: 1 | -1) => {
    if (readOnly) return;
    setMatch(prevMatch => {
      const currentScore = team === 't1' ? prevMatch.t1_score : prevMatch.t2_score;
      const newScore = currentScore + delta;
      if (newScore < 0 || newScore > 10) return prevMatch;
      if (team === 't1') return { ...prevMatch, t1_score: newScore };
      else return { ...prevMatch, t2_score: newScore };
    });
  };

  const handlePlayerClick = (slot: PlayerSlot) => {
    if (readOnly) return;
    setCurrentSlot(slot);
    setIsModalOpen(true);
  };

  const getExcludedPlayerIds = (): number[] => {
    const currentSlotPlayerId = currentSlot ? match[currentSlot]?.id : null;
    const allPlayerIds = [
      match.t1_gk?.id,
      match.t1_st?.id,
      match.t2_gk?.id,
      match.t2_st?.id
    ].filter((id): id is number => id !== null && id !== currentSlotPlayerId);
    return allPlayerIds;
  };

  const handleSelectPlayer = (player: PlayerType) => {
    if (currentSlot) {
      setMatch(prevMatch => ({ ...prevMatch, [currentSlot]: player }));
    }
    setIsModalOpen(false);
    setCurrentSlot(null);
  };

  const handleAcceptMatch = (slot: PlayerSlot) => {
    if (readOnly || !match.id) return;

    const player = match[slot];
    if (!player) return;

    setLoadingSlot(slot);
    setActionType('accept');
    acceptMatchApi(match.id, player.id)
      .then(() => {
        setMatch(prevMatch => {
          const newMatch = { ...prevMatch };
          switch (slot) {
            case 't1_gk': newMatch.t1_gk_status = PLAYER_STATUS.ACCEPTED; break;
            case 't1_st': newMatch.t1_st_status = PLAYER_STATUS.ACCEPTED; break;
            case 't2_gk': newMatch.t2_gk_status = PLAYER_STATUS.ACCEPTED; break;
            case 't2_st': newMatch.t2_st_status = PLAYER_STATUS.ACCEPTED; break;
          }
          return newMatch;
        });
        setToast({ message: 'Match accepted successfully!', type: 'success' });
      })
      .catch(err => {
        console.error('Failed to accept match:', err);
        setToast({ message: 'Failed to accept match. Please try again.', type: 'error' });
      })
      .finally(() => {
        setLoadingSlot(null);
        setActionType(null);
      });
  };

  const handleRejectMatch = (slot: PlayerSlot) => {
    if (readOnly || !match.id) return;

    const player = match[slot];
    if (!player) return;

    setLoadingSlot(slot);
    setActionType('reject');
    rejectMatchApi(match.id, player.id)
      .then(() => {
        setMatch(prevMatch => {
          const newMatch = { ...prevMatch };
          switch (slot) {
            case 't1_gk': newMatch.t1_gk_status = PLAYER_STATUS.REJECTED; break;
            case 't1_st': newMatch.t1_st_status = PLAYER_STATUS.REJECTED; break;
            case 't2_gk': newMatch.t2_gk_status = PLAYER_STATUS.REJECTED; break;
            case 't2_st': newMatch.t2_st_status = PLAYER_STATUS.REJECTED; break;
          }
          return newMatch;
        });
        setToast({ message: 'Match rejected successfully!', type: 'success' });
      })
      .catch(err => {
        console.error('Failed to reject match:', err);
        setToast({ message: 'Failed to reject match. Please try again.', type: 'error' });
      })
      .finally(() => {
        setLoadingSlot(null);
        setActionType(null);
      });
  };

  const handleRegisterMatch = () => {
    if (!match.t1_gk || !match.t1_st || !match.t2_gk || !match.t2_st) {
      setToast({ message: 'Please select all 4 players before registering the match.', type: 'error' });
      return;
    }

    if (match.t1_score === match.t2_score) {
      setToast({ message: 'Cannot register a match with a tie score. Please adjust the scores.', type: 'error' });
      return;
    }

    const request: RegisterMatchRequest = {
      t1_gk: match.t1_gk.id,
      t1_st: match.t1_st.id,
      t2_gk: match.t2_gk.id,
      t2_st: match.t2_st.id,
      t1_score: match.t1_score,
      t2_score: match.t2_score,
    };

    setRegistering(true);
    registerMutation.mutate(request, {
      onSuccess: (response) => {
        setToast({ message: `Match registered successfully! ID: ${response.id}`, type: 'success' });
        setTimeout(() => {
          navigate(`/match/${response.id}`, { state: { readOnly: true } });
        }, 1500);
      },
      onError: (err) => {
        console.error('Failed to register match:', err);
        setToast({ message: 'Failed to register match. Please try again.', type: 'error' });
      },
      onSettled: () => {
        setRegistering(false);
      },
    });
  };

  return (
    <PageLayout variant="full" backgroundColor="#ffffff">
      {(loading && matchId) ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Spinner size="large" />
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading match...</p>
        </div>
      ) : (
        <div className="game-container">
          <div className="scoreboard-container">
            <Scoreboard
              t1_score={match.t1_score}
              t2_score={match.t2_score}
              onScoreChange={handleScoreChange}
              readOnly={readOnly}
            />
          </div>
          <div className="game-area">
            <FoosballTable />
            <div className="team team-left">
              <Player
                player={match.t1_gk}
                status={match.status}
                playerStatus={match.t1_gk_status}
                isCurrentUser={match.t1_gk?.id === currentUserId}
                onAccept={() => handleAcceptMatch('t1_gk')}
                onReject={() => handleRejectMatch('t1_gk')}
                onClick={() => handlePlayerClick('t1_gk')}
                readOnly={readOnly}
                isLoading={loadingSlot === 't1_gk'}
                actionType={loadingSlot === 't1_gk' ? actionType : null}
              />
              <Player
                player={match.t1_st}
                status={match.status}
                playerStatus={match.t1_st_status}
                isCurrentUser={match.t1_st?.id === currentUserId}
                onAccept={() => handleAcceptMatch('t1_st')}
                onReject={() => handleRejectMatch('t1_st')}
                onClick={() => handlePlayerClick('t1_st')}
                readOnly={readOnly}
                isLoading={loadingSlot === 't1_st'}
                actionType={loadingSlot === 't1_st' ? actionType : null}
              />
            </div>
            <div className="team team-right">
              <Player
                player={match.t2_gk}
                status={match.status}
                playerStatus={match.t2_gk_status}
                isCurrentUser={match.t2_gk?.id === currentUserId}
                onAccept={() => handleAcceptMatch('t2_gk')}
                onReject={() => handleRejectMatch('t2_gk')}
                onClick={() => handlePlayerClick('t2_gk')}
                readOnly={readOnly}
                isLoading={loadingSlot === 't2_gk'}
                actionType={loadingSlot === 't2_gk' ? actionType : null}
              />
              <Player
                player={match.t2_st}
                status={match.status}
                playerStatus={match.t2_st_status}
                isCurrentUser={match.t2_st?.id === currentUserId}
                onAccept={() => handleAcceptMatch('t2_st')}
                onReject={() => handleRejectMatch('t2_st')}
                onClick={() => handlePlayerClick('t2_st')}
                readOnly={readOnly}
                isLoading={loadingSlot === 't2_st'}
                actionType={loadingSlot === 't2_st' ? actionType : null}
              />
            </div>
          </div>
          {!readOnly && (
            <button
              className="register-match-button"
              onClick={handleRegisterMatch}
              disabled={registering}
            >
              {registering ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Spinner size="small" color="white" />
                  Registering...
                </span>
              ) : (
                'Register Match'
              )}
            </button>
          )}
        </div>
      )}

      <PlayerSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectPlayer={handleSelectPlayer}
        excludePlayerIds={getExcludedPlayerIds()}
      />

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

export { MatchPage as default };
