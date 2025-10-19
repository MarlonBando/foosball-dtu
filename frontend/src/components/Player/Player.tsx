import React from 'react';
import './Player.css';
import type { Player as PlayerType } from '../../types';
import { MatchStatus, PlayerStatus } from '../../types';

interface PlayerProps {
  player: PlayerType | null;
  status: MatchStatus;
  playerStatus: PlayerStatus;
  isCurrentUser: boolean;
  onAccept: () => void;
  onClick?: () => void;
  readOnly: boolean;
}

const Player: React.FC<PlayerProps> = ({ player, status, playerStatus, isCurrentUser, onAccept, onClick, readOnly }) => {
  const renderStatus = () => {
    switch (status) {
      case MatchStatus.Completed:
        return <div className="status-icon">✅</div>;
      case MatchStatus.Rejected:
        return <div className="status-icon">❌</div>;
      case MatchStatus.Pending:
        if (isCurrentUser && playerStatus === PlayerStatus.Pending && !readOnly) {
          return <button onClick={onAccept} className="accept-button">Accept</button>;
        }
        switch (playerStatus) {
          case PlayerStatus.Accepted:
            return <div className="status-icon">⏳</div>;
          case PlayerStatus.Rejected:
            return <div className="status-icon">❌</div>;
          case PlayerStatus.Pending:
            return <div className="status-icon">❔</div>;
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
        {player.name}
      </div>
      <div className="player-status">
        {renderStatus()}
      </div>
    </div>
  );
};

export default Player;