import React from 'react';
import './Player.css';
import Spinner from '../Spinner/Spinner';
import type { Player as PlayerType, MatchStatus, PlayerStatus } from '../../types';
import { MATCH_STATUS, PLAYER_STATUS } from '../../types';

interface PlayerProps {
  player: PlayerType | null;
  status: MatchStatus;
  playerStatus: PlayerStatus;
  isCurrentUser: boolean;
  onAccept: () => void;
  onReject: () => void;
  onClick?: () => void;
  readOnly: boolean;
  isLoading?: boolean;
  actionType?: 'accept' | 'reject' | null;
}

const Player: React.FC<PlayerProps> = ({ player, status, playerStatus, isCurrentUser, onAccept, onReject, onClick, readOnly, isLoading = false, actionType = null }) => {
  const renderStatus = () => {
    switch (status) {
      case MATCH_STATUS.COMPLETED:
        return <div className="status-icon">✅</div>;
      case MATCH_STATUS.REJECTED:
        return <div className="status-icon">❌</div>;
      case MATCH_STATUS.PENDING:
        if (isCurrentUser && playerStatus === PLAYER_STATUS.PENDING && !readOnly) {
          return (
            <div className="action-buttons">
              <button onClick={onAccept} className="accept-button" disabled={isLoading}>
                {isLoading && actionType === 'accept' ? (
                  <Spinner size="small" color="white" />
                ) : (
                  '✓'
                )}
              </button>
              <button onClick={onReject} className="reject-button" disabled={isLoading}>
                {isLoading && actionType === 'reject' ? (
                  <Spinner size="small" color="white" />
                ) : (
                  '✕'
                )}
              </button>
            </div>
          );
        }
        switch (playerStatus) {
          case PLAYER_STATUS.ACCEPTED:
            return <div className="status-icon">⏳</div>;
          case PLAYER_STATUS.REJECTED:
            return <div className="status-icon">❌</div>;
          case PLAYER_STATUS.PENDING:
            return <div className="status-icon">⏳</div>;
          default:
            return null;
        }
      default:
        return null;
    }
  };

  if (!player) {
    return (
      <div className="player-container" onClick={readOnly ? undefined : onClick}>
        <div className="player empty"></div>
      </div>
    );
  }

  return (
    <div className="player-container" >
      <div className="player" title={`${player.name} ${player.surname}`} onClick={readOnly ? undefined : onClick}>
        <span className="player-initial">{player.name[0]}</span>
      </div>
      <div className="player-name">
        {player.username}
      </div>
      <div className="player-status">
        {renderStatus()}
      </div>
    </div>
  );
};

export default Player;