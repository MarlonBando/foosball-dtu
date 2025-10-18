import React from 'react';
import './Player.css';
import type { Player as PlayerType } from '../../types';

interface PlayerProps {
  player: PlayerType | null;
  onClick?: () => void;
}

const Player: React.FC<PlayerProps> = ({ player, onClick }) => {
  if (!player) {
    return (
      <div className="player-container" onClick={onClick}>
        <div className="player empty"></div>
      </div>
    );
  }

  return (
    <div className="player-container" onClick={onClick}>
      <div className="player" title={`${player.name} ${player.surname}`}>
        <span className="player-initial">{player.name[0]}</span>
      </div>
      <div className="player-name">
        {player.name}
      </div>
    </div>
  );
};

export default Player;
