import React from 'react';
import type { Player } from '../../types';
import { getNationalityFlag } from '../../utils/nationality';
import './PlayerRankingCard.css';

interface PlayerRankingCardProps {
  player: Player;
  rank?: number;
  isCurrentUser?: boolean;
  showRank?: boolean;
  showWinLoss?: boolean;
  onClick?: (player: Player) => void;
  className?: string;
}

const PlayerRankingCard: React.FC<PlayerRankingCardProps> = ({
  player,
  rank,
  isCurrentUser = false,
  showRank = true,
  showWinLoss = true,
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  return (
    <div
      className={`player-ranking-card ${isCurrentUser ? 'player-ranking-card-current' : ''} ${onClick ? 'player-ranking-card-clickable' : ''} ${className}`}
      onClick={handleClick}
    >
      <div className="player-ranking-card-left">
        {showRank && rank !== undefined && (
          <div className="player-ranking-card-rank">
            #{rank}
          </div>
        )}
        <div className="player-ranking-card-info">
          <div className="player-ranking-card-main">
            <span className="player-ranking-card-flag">{getNationalityFlag(player.nationality)}</span>
            <h3 className={`player-ranking-card-username ${isCurrentUser ? 'player-ranking-card-username-current' : ''}`}>
              {player.username}
            </h3>
            {isCurrentUser && (
              <span className="player-ranking-card-you-badge">
                You
              </span>
            )}
          </div>
          {showWinLoss && (
            <div className="player-ranking-card-stats">
              <span className="player-ranking-card-wins">{player.wins}W</span>
              <span className="player-ranking-card-separator">/</span>
              <span className="player-ranking-card-losses">{player.losses}L</span>
            </div>
          )}
        </div>
      </div>
      <div className="player-ranking-card-elo">
        {player.elo}
      </div>
    </div>
  );
};

export default PlayerRankingCard;
