import React from 'react';
import './Scoreboard.css';

interface ScoreboardProps {
  blueScore: number;
  redScore: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ blueScore, redScore }) => {
  const formatScore = (score: number) => {
    return score.toString().padStart(2, '0');
  };

  return (
    <div className="scoreboard">
      <div className="score blue">
        <span className="digit">{formatScore(blueScore)[0]}</span>
        <span className="digit">{formatScore(blueScore)[1]}</span>
      </div>
      <div className="score red">
        <span className="digit">{formatScore(redScore)[0]}</span>
        <span className="digit">{formatScore(redScore)[1]}</span>
      </div>
    </div>
  );
};

export default Scoreboard;
