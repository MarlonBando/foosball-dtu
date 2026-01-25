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

// Mapping of nationality IDs to ISO country codes
const NATIONALITY_CODES: { [key: number]: string } = {
  1: 'AF', 2: 'AL', 3: 'DZ', 4: 'AD', 5: 'AO', 6: 'AR', 7: 'AM', 8: 'AU', 9: 'AT', 10: 'AZ',
  11: 'BS', 12: 'BH', 13: 'BD', 14: 'BB', 15: 'BY', 16: 'BE', 17: 'BZ', 18: 'BJ', 19: 'BT', 20: 'BO',
  21: 'BA', 22: 'BW', 23: 'BR', 24: 'BN', 25: 'BG', 26: 'BF', 27: 'BI', 28: 'KH', 29: 'CM', 30: 'CA',
  31: 'CV', 32: 'CF', 33: 'TD', 34: 'CL', 35: 'CN', 36: 'CO', 37: 'KM', 38: 'CG', 39: 'CD', 40: 'CR',
  41: 'HR', 42: 'CU', 43: 'CY', 44: 'CZ', 45: 'DK', 46: 'DJ', 47: 'DM', 48: 'DO', 49: 'EC', 50: 'EG',
  51: 'SV', 52: 'GQ', 53: 'ER', 54: 'EE', 55: 'ET', 56: 'FJ', 57: 'FI', 58: 'FR', 59: 'GA', 60: 'GM',
  61: 'GE', 62: 'DE', 63: 'GH', 64: 'GR', 65: 'GD', 66: 'GT', 67: 'GN', 68: 'GW', 69: 'GY', 70: 'HT',
  71: 'HN', 72: 'HU', 73: 'IS', 74: 'IN', 75: 'ID', 76: 'IR', 77: 'IQ', 78: 'IE', 79: 'IL', 80: 'IT',
  81: 'JM', 82: 'JP', 83: 'JO', 84: 'KZ', 85: 'KE', 86: 'KI', 87: 'KP', 88: 'KR', 89: 'KW', 90: 'KG',
  91: 'LA', 92: 'LV', 93: 'LB', 94: 'LS', 95: 'LR', 96: 'LY', 97: 'LI', 98: 'LT', 99: 'LU', 100: 'MG',
  101: 'MW', 102: 'MY', 103: 'MV', 104: 'ML', 105: 'MT', 106: 'MH', 107: 'MR', 108: 'MU', 109: 'MX', 110: 'FM',
  111: 'MD', 112: 'MC', 113: 'MN', 114: 'ME', 115: 'MA', 116: 'MZ', 117: 'MM', 118: 'NA', 119: 'NR', 120: 'NP',
  121: 'NL', 122: 'NZ', 123: 'NI', 124: 'NE', 125: 'NG', 126: 'NO', 127: 'OM', 128: 'PK', 129: 'PW', 130: 'PA',
  131: 'PG', 132: 'PY', 133: 'PE', 134: 'PH', 135: 'PL', 136: 'PT', 137: 'QA', 138: 'RO', 139: 'RU', 140: 'RW',
  141: 'KN', 142: 'LC', 143: 'VC', 144: 'WS', 145: 'SM', 146: 'ST', 147: 'SA', 148: 'SN', 149: 'RS', 150: 'SC',
  151: 'SL', 152: 'SG', 153: 'SK', 154: 'SI', 155: 'SB', 156: 'SO', 157: 'ZA', 158: 'ES', 159: 'LK', 160: 'SD',
  161: 'SR', 162: 'SZ', 163: 'SE', 164: 'CH', 165: 'SY', 166: 'TW', 167: 'TJ', 168: 'TZ', 169: 'TH', 170: 'TL',
  171: 'TG', 172: 'TO', 173: 'TT', 174: 'TN', 175: 'TR', 176: 'TM', 177: 'TV', 178: 'UG', 179: 'UA', 180: 'AE',
  181: 'GB', 182: 'US', 183: 'UY', 184: 'UZ', 185: 'VU', 186: 'VA', 187: 'VE', 188: 'VN', 189: 'YE', 190: 'ZM',
  191: 'ZW'
};

// Helper function to convert ISO country code to flag emoji
const getNationalityFlag = (nationalityId: number): string => {
  const code = NATIONALITY_CODES[nationalityId];
  if (!code) return '🌍';
  
  // Convert ISO 3166-1 alpha-2 country code to flag emoji
  // Each letter maps to a regional indicator symbol (🇦 = U+1F1E6, 🇧 = U+1F1E7, etc.)
  return String.fromCodePoint(
    ...[...code].map(char => 0x1F1E6 - 65 + char.charCodeAt(0))
  );
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
