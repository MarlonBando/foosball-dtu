import React, { useState, useEffect } from 'react';
import './Scoreboard.css';

interface ScoreboardProps {
  t1_score: number;
  t2_score: number;
  onScoreChange: (team: 't1' | 't2', delta: 1 | -1) => void;
  readOnly: boolean;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ t1_score, t2_score, onScoreChange, readOnly }) => {
  const [activeTeam, setActiveTeam] = useState<'t1' | 't2' | null>(null);
  const [inputBuffer, setInputBuffer] = useState<string>('');

  const formatScore = (score: number) => {
    return score.toString().padStart(2, '0');
  };

  useEffect(() => {
    if (!activeTeam || readOnly) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;
      
      // Handle number keys 0-9
      if (key >= '0' && key <= '9') {
        const newBuffer = inputBuffer + key;
        const potentialScore = parseInt(newBuffer);
        
        // If it's a single digit, just store it
        if (newBuffer.length === 1) {
          setInputBuffer(newBuffer);
        } else if (newBuffer.length === 2) {
          // Two digits entered - only accept if it's "10"
          if (potentialScore === 10) {
            const currentScore = activeTeam === 't1' ? t1_score : t2_score;
            const delta = 10 - currentScore;
            
            if (delta > 0) {
              for (let i = 0; i < delta; i++) {
                onScoreChange(activeTeam, 1);
              }
            } else if (delta < 0) {
              for (let i = 0; i < Math.abs(delta); i++) {
                onScoreChange(activeTeam, -1);
              }
            }
          }
          setInputBuffer('');
          setActiveTeam(null);
        }
      } else if (key === 'Enter') {
        // Enter immediately confirms current input
        if (inputBuffer.length >= 1) {
          const newScore = parseInt(inputBuffer);
          if (newScore >= 0 && newScore <= 10) {
            const currentScore = activeTeam === 't1' ? t1_score : t2_score;
            const delta = newScore - currentScore;
            
            if (delta > 0) {
              for (let i = 0; i < delta; i++) {
                onScoreChange(activeTeam, 1);
              }
            } else if (delta < 0) {
              for (let i = 0; i < Math.abs(delta); i++) {
                onScoreChange(activeTeam, -1);
              }
            }
          }
        }
        setInputBuffer('');
        setActiveTeam(null);
      } else if (key === 'Escape') {
        setInputBuffer('');
        setActiveTeam(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [activeTeam, t1_score, t2_score, onScoreChange, readOnly, inputBuffer]);

  const handleScoreClick = (team: 't1' | 't2') => {
    if (readOnly) return;
    setInputBuffer('');
    setActiveTeam(team);
  };

  return (
    <div className="scoreboard">
      <div className="score-container">
        <div 
          className={`score team1 ${activeTeam === 't1' ? 'active' : ''}`}
          onClick={() => handleScoreClick('t1')}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          {activeTeam === 't1' && inputBuffer ? (
            <>
              <span className="digit">{inputBuffer.padStart(2, '0')[0]}</span>
              <span className="digit">{inputBuffer.padStart(2, '0')[1]}</span>
            </>
          ) : (
            <>
              <span className="digit">{formatScore(t1_score)[0]}</span>
              <span className="digit">{formatScore(t1_score)[1]}</span>
            </>
          )}
        </div>
        <div className="score-controls">
          <button onClick={() => onScoreChange('t1', 1)} disabled={readOnly}>+</button>
          <button onClick={() => onScoreChange('t1', -1)} disabled={readOnly}>-</button>
        </div>
      </div>
      <div className="score-container">
        <div 
          className={`score team2 ${activeTeam === 't2' ? 'active' : ''}`}
          onClick={() => handleScoreClick('t2')}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          {activeTeam === 't2' && inputBuffer ? (
            <>
              <span className="digit">{inputBuffer.padStart(2, '0')[0]}</span>
              <span className="digit">{inputBuffer.padStart(2, '0')[1]}</span>
            </>
          ) : (
            <>
              <span className="digit">{formatScore(t2_score)[0]}</span>
              <span className="digit">{formatScore(t2_score)[1]}</span>
            </>
          )}
        </div>
        <div className="score-controls">
          <button onClick={() => onScoreChange('t2', 1)} disabled={readOnly}>+</button>
          <button onClick={() => onScoreChange('t2', -1)} disabled={readOnly}>-</button>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;