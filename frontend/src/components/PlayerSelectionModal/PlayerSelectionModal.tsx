import React, { useState, useMemo } from 'react';
import { useAllPlayers } from '../../hooks/useAllPlayers';
import type { Player as PlayerType } from '../../types';
import { Search, X, Users } from 'lucide-react';
import PlayerRankingCard from '../PlayerRankingCard/PlayerRankingCard';
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

  // Use React Query hook - data will already be cached from prefetch!
  const { data: playersData = [], isPending: loading } = useAllPlayers();

  // Sort all players by ELO descending to calculate ranks
  const sortedPlayers = useMemo(() =>
    [...playersData].sort((a, b) => b.elo - a.elo),
    [playersData]
  );

  const filteredPlayers = useMemo(() => {
    let filtered = sortedPlayers;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (player) =>
          player.username.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    return filtered.filter(player => !excludePlayerIds.includes(player.id));
  }, [sortedPlayers, searchTerm, excludePlayerIds]);

  const handlePlayerClick = (player: PlayerType) => {
    onSelectPlayer(player);
    onClose(); // Close modal automatically after selection
  };

  if (!isOpen) {
    return null;
  }

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className={`player-selection-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="player-selection-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="player-selection-modal-header">
          <div className="player-selection-modal-title-container">
            <Users className="player-selection-modal-icon" size={24} />
            <h2 className="player-selection-modal-title">Select Player</h2>
          </div>
          <button className="player-selection-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="player-selection-modal-search-container">
          <Search className="player-selection-modal-search-icon" size={18} />
          <input
            type="text"
            placeholder="Search by name or username..."
            className="player-selection-modal-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="player-selection-modal-clear" onClick={handleClear} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="player-selection-modal-list">
          {loading ? (
            <div className="player-selection-modal-loading">Loading players...</div>
          ) : filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => {
              const rank = sortedPlayers.findIndex(p => p.id === player.id) + 1;
              return (
                <PlayerRankingCard
                  key={player.id}
                  player={player}
                  rank={rank}
                  showRank={true}
                  showWinLoss={true}
                  onClick={handlePlayerClick}
                />
              );
            })
          ) : (
            <div className="player-selection-modal-no-results">No players found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionModal;
