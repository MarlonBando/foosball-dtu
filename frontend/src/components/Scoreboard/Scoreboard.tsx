import React from 'react';
import './Scoreboard.css';

interface ScoreboardProps {
  t1_score: number;
  t2_score: number;
  onScoreChange: (team: 't1' | 't2', delta: 1 | -1) => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ t1_score, t2_score, onScoreChange }) => {
  const formatScore = (score: number) => {
    return score.toString().padStart(2, '0');
  };

  return (
    <div className="scoreboard">
      <div className="score-container">
        <div className="score team1">
          <span className="digit">{formatScore(t1_score)[0]}</span>
          <span className="digit">{formatScore(t1_score)[1]}</span>
        </div>
        <div className="score-controls">
          <button onClick={() => onScoreChange('t1', 1)}>+</button>
          <button onClick={() => onScoreChange('t1', -1)}>-</button>
        </div>
      </div>
      <div className="score-container">
        <div className="score team2">
          <span className="digit">{formatScore(t2_score)[0]}</span>
          <span className="digit">{formatScore(t2_score)[1]}</span>
        </div>
        <div className="score-controls">
          <button onClick={() => onScoreChange('t2', 1)}>+</button>
          <button onClick={() => onScoreChange('t2', -1)}>-</button>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
