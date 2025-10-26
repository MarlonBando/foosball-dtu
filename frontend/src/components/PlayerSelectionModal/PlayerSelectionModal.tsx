import React, { useState, useMemo, useEffect } from 'react';
import { getAllPlayers } from '../../api';
import type { Player as PlayerType } from '../../types';
import './PlayerSelectionModal.css';

interface PlayerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayer: (player: PlayerType) => void;
  excludePlayerIds?: number[];
}

const PlayerSelectionModal: React.FC<PlayerSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectPlayer,
  excludePlayerIds = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAllPlayers()
        .then(setPlayers)
        .catch(err => console.error('Failed to load players:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const filteredPlayers = useMemo(() => {
    let filtered = players;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (player) =>
          player.username.toLowerCase().includes(lowercasedSearchTerm) ||
          player.name.toLowerCase().includes(lowercasedSearchTerm) ||
          player.surname.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    return filtered.filter(player => !excludePlayerIds.includes(player.id));
  }, [players, searchTerm, excludePlayerIds]);

  const handlePlayerClick = (player: PlayerType) => {
    onSelectPlayer(player);
    onClose(); // Close modal automatically after selection
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`player-selection-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="player-selection-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="player-selection-modal-close" onClick={onClose}>X</button>
        <input
          type="text"
          placeholder="Search players..."
          className="player-selection-modal-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="player-selection-modal-list">
          {loading ? (
            <div className="player-selection-modal-loading">Loading players...</div>
          ) : filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="player-selection-modal-item"
                onClick={() => handlePlayerClick(player)}
              >
                <span className="player-selection-modal-item-username">{player.username}</span>
                <span className="player-selection-modal-item-elo">ELO: {player.elo}</span>
              </div>
            ))
          ) : (
            <div className="player-selection-modal-no-results">No players found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionModal;
