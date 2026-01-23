import React, { useState, useMemo } from 'react';
import { useAllPlayers } from '../../hooks/useAllPlayers';
import type { Player as PlayerType } from '../../types';
import { Search, X, Users } from 'lucide-react';
import './PlayerSelectionModal.css';

interface PlayerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayer: (player: PlayerType) => void;
  excludePlayerIds?: number[];
}

// Helper function to get flag emoji from nationality ID
const getNationalityFlag = (nationalityId: number): string => {
  const flagMap: { [key: number]: string } = {
    1: '🇮🇹', // Italy
    2: '🇩🇰', // Denmark
    3: '🇺🇸', // USA
    4: '🇬🇧', // UK
    5: '🇩🇪', // Germany
    6: '🇫🇷', // France
    7: '🇪🇸', // Spain
    8: '🇵🇹', // Portugal
    9: '🇳🇱', // Netherlands
    10: '🇧🇪', // Belgium
    11: '🇸🇪', // Sweden
    12: '🇳🇴', // Norway
    13: '🇫🇮', // Finland
    14: '🇵🇱', // Poland
    15: '🇨🇭', // Switzerland
    16: '🇦🇹', // Austria
    17: '🇬🇷', // Greece
    18: '🇮🇪', // Ireland
    19: '🇨🇿', // Czech Republic
    20: '🇭🇺', // Hungary
    21: '🇷🇴', // Romania
    22: '🇧🇬', // Bulgaria
    23: '🇭🇷', // Croatia
    24: '🇷🇸', // Serbia
    25: '🇺🇦', // Ukraine
    26: '🇷🇺', // Russia
    27: '🇹🇷', // Turkey
    28: '🇮🇱', // Israel
    29: '🇸🇦', // Saudi Arabia
    30: '🇦🇪', // UAE
    31: '🇮🇳', // India
    32: '🇨🇳', // China
    33: '🇯🇵', // Japan
    34: '🇰🇷', // South Korea
    35: '🇹🇭', // Thailand
    36: '🇻🇳', // Vietnam
    37: '🇵🇭', // Philippines
    38: '🇮🇩', // Indonesia
    39: '🇲🇾', // Malaysia
    40: '🇸🇬', // Singapore
    41: '🇦🇺', // Australia
    42: '🇳🇿', // New Zealand
    43: '🇿🇦', // South Africa
    44: '🇪🇬', // Egypt
    45: '🇳🇬', // Nigeria
    46: '🇰🇪', // Kenya
    47: '🇧🇷', // Brazil
    48: '🇦🇷', // Argentina
    49: '🇲🇽', // Mexico
    50: '🇨🇱', // Chile
    51: '🇨🇴', // Colombia
    52: '🇵🇪', // Peru
    53: '🇨🇦', // Canada
  };
  return flagMap[nationalityId] || '🌍';
};

const PlayerSelectionModal: React.FC<PlayerSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectPlayer,
  excludePlayerIds = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Use React Query hook - data will already be cached from prefetch!
  const { data: players = [], isPending: loading } = useAllPlayers();

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
            filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="player-selection-modal-item"
                onClick={() => handlePlayerClick(player)}
              >
                <div className="player-selection-modal-player-card">
                  <div className="player-selection-modal-player-flag">
                    {getNationalityFlag(player.nationality)}
                  </div>
                  <div className="player-selection-modal-player-info">
                    <div className="player-selection-modal-player-username">{player.username}</div>
                  </div>
                </div>
                <div className="player-selection-modal-item-elo">{player.elo}</div>
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
