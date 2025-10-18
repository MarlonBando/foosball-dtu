import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import FoosballTable from '../../components/FoosballTable/FoosballTable';
import Player from '../../components/Player/Player';
import Scoreboard from '../../components/Scoreboard/Scoreboard';
import PlayerSelectionModal from '../../components/PlayerSelectionModal/PlayerSelectionModal';
import PageLayout from '../../components/PageLayout/PageLayout';
import './MatchPage.css';
import type { Match, Player as PlayerType } from '../../types';

// Mock Data as requested
const mockPlayer1: PlayerType = { id: 1, created_at: new Date().toISOString(), username: 'johndoe', elo: 1200, name: 'John', surname: 'Doe', nationality: 1 };
const mockPlayer2: PlayerType = { id: 2, created_at: new Date().toISOString(), username: 'janedoe', elo: 1250, name: 'Jane', surname: 'Doe', nationality: 2 };
const mockPlayer3: PlayerType = { id: 3, created_at: new Date().toISOString(), username: 'peterp', elo: 1100, name: 'Peter', surname: 'Pan', nationality: 3 };
const mockPlayer4: PlayerType = { id: 4, created_at: new Date().toISOString(), username: 'maryj', elo: 1300, name: 'Mary', surname: 'Jane', nationality: 4 };
const mockPlayer5: PlayerType = { id: 5, created_at: new Date().toISOString(), username: 'sarahk', elo: 1150, name: 'Sarah', surname: 'K', nationality: 1 };
const mockPlayer6: PlayerType = { id: 6, created_at: new Date().toISOString(), username: 'mikeb', elo: 1050, name: 'Mike', surname: 'B', nationality: 2 };

// Mock list of all players for the selection modal
const mockAllPlayers: PlayerType[] = [
  mockPlayer1,
  mockPlayer2,
  mockPlayer3,
  mockPlayer4,
  mockPlayer5,
  mockPlayer6,
  { id: 7, created_at: new Date().toISOString(), username: 'alice', elo: 1350, name: 'Alice', surname: 'A', nationality: 3 },
  { id: 8, created_at: new Date().toISOString(), username: 'bob', elo: 1180, name: 'Bob', surname: 'B', nationality: 4 },
  { id: 9, created_at: new Date().toISOString(), username: 'charlie', elo: 1220, name: 'Charlie', surname: 'C', nationality: 1 },
  { id: 10, created_at: new Date().toISOString(), username: 'diana', elo: 1280, name: 'Diana', surname: 'D', nationality: 2 },
];

type PlayerSlot = 't1_gk' | 't1_st' | 't2_gk' | 't2_st';

const initialMatch: Match = {
  id: null,
  created_at: null,
  t1_gk: mockPlayer1,
  t1_st: mockPlayer2,
  t2_gk: mockPlayer3,
  t2_st: mockPlayer4,
  table: 1,
  t1_score: 0,
  t2_score: 0,
};

const MatchPage: React.FC = () => {
  const [match, setMatch] = useState<Match>(initialMatch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<PlayerSlot | null>(null);

  const handleScoreChange = (team: 't1' | 't2', delta: 1 | -1) => {
    setMatch(prevMatch => {
      const currentScore = team === 't1' ? prevMatch.t1_score : prevMatch.t2_score;
      const newScore = currentScore + delta;

      // Score must be between 0 and 10
      if (newScore < 0 || newScore > 10) {
        return prevMatch;
      }

      if (team === 't1') {
        return { ...prevMatch, t1_score: newScore };
      }
      else {
        return { ...prevMatch, t2_score: newScore };
      }
    });
  };

  const handlePlayerClick = (slot: PlayerSlot) => {
    setCurrentSlot(slot);
    setIsModalOpen(true);
  };

  const handleSelectPlayer = (player: PlayerType) => {
    if (currentSlot) {
      setMatch(prevMatch => ({
        ...prevMatch,
        [currentSlot]: player,
      }));
    }
    setIsModalOpen(false);
    setCurrentSlot(null);
  };

  const registerMatch = () => {
    // 1. Transform the React state into the flat structure for the backend.
    const apiPayload = {
      t1_gk: match.t1_gk?.id,
      t1_st: match.t1_st?.id,
      t2_gk: match.t2_gk?.id,
      t2_st: match.t2_st?.id,
      table: match.table,
      t1_score: match.t1_score,
      t2_score: match.t2_score,
      // Individual player scores can be added here later if needed
    };

    // 2. For now, just log the payload to the console.
    // In the future, this is where you would send it to your API.
    console.log("Match data to be sent to API:", apiPayload);
    alert('Match data prepared and logged to console! (Press F12 to view)');
  };

  return (
    <PageLayout variant="full" backgroundColor="#ffffff">
      <div className="game-container">
        <div className="scoreboard-container">
          <Scoreboard
            t1_score={match.t1_score}
            t2_score={match.t2_score}
            onScoreChange={handleScoreChange}
          />
        </div>
        <div className="game-area">
          <FoosballTable />
          <div className="team team-left">
            <Player player={match.t1_gk} onClick={() => handlePlayerClick('t1_gk')} />
            <Player player={match.t1_st} onClick={() => handlePlayerClick('t1_st')} />
          </div>
          <div className="team team-right">
            <Player player={match.t2_gk} onClick={() => handlePlayerClick('t2_gk')} />
            <Player player={match.t2_st} onClick={() => handlePlayerClick('t2_st')} />
          </div>
        </div>
        <button className="register-match-button" onClick={registerMatch}>
          Register Match
        </button>
      </div>

      <PlayerSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectPlayer={handleSelectPlayer}
        players={mockAllPlayers}
      />
    </PageLayout>
  );
};

export { MatchPage as default };
