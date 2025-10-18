import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import FoosballTable from '../../components/FoosballTable/FoosballTable';
import Player from '../../components/Player/Player';
import Scoreboard from '../../components/Scoreboard/Scoreboard';
import './MatchPage.css';

const MatchPage: React.FC = () => {
  return (
    <div className="match-page">
      <Navbar />
      <div className="game-container">
        <div className="scoreboard-container">
          <Scoreboard blueScore={3} redScore={5} />
        </div>
        <div className="game-area">
          <FoosballTable />
          <div className="team team-left">
            <Player />
            <Player />
          </div>
          <div className="team team-right">
            <Player />
            <Player />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
