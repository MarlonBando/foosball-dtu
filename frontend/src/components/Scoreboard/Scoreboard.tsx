import React, { useState, useEffect, useRef } from 'react';
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
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const lastViewportHeightRef = useRef<number>(window.visualViewport?.height || window.innerHeight);

  const formatScore = (score: number) => {
    return score.toString().padStart(2, '0');
  };

  // Focus hidden input when activeTeam changes
  useEffect(() => {
    if (!activeTeam || readOnly) return;
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [activeTeam, readOnly]);

  // Detect keyboard hide via visual viewport changes
  useEffect(() => {
    if (!activeTeam || readOnly) return;

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const lastHeight = lastViewportHeightRef.current;
      
      // Keyboard is closing if viewport height increased significantly
      if (currentHeight > lastHeight + 50) {
        console.log('Keyboard closing detected via viewport resize');
        if (activeTeam) {
          const parsed = inputBuffer ? parseInt(inputBuffer, 10) : 0;
          if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 10) {
            applyScore(activeTeam, parsed);
          }
          setInputBuffer('');
          setActiveTeam(null);
        }
      }
      
      lastViewportHeightRef.current = currentHeight;
    };

    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.addEventListener('resize', handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [activeTeam, readOnly, inputBuffer]);

  // Handle escape key
  useEffect(() => {
    if (!activeTeam || readOnly) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInputBuffer('');
        setActiveTeam(null);
        hiddenInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [activeTeam, readOnly]);

  const applyScore = (team: 't1' | 't2', newScore: number) => {
    const clamped = Math.max(0, Math.min(10, newScore));
    const currentScore = team === 't1' ? t1_score : t2_score;
    const delta = clamped - currentScore;
    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        onScoreChange(team, 1);
      }
    } else if (delta < 0) {
      for (let i = 0; i < Math.abs(delta); i++) {
        onScoreChange(team, -1);
      }
    }
  };

  const commitInput = () => {
    if (!activeTeam) {
      setInputBuffer('');
      return;
    }
    
    if (inputBuffer) {
      const parsed = parseInt(inputBuffer);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 10) {
        applyScore(activeTeam, parsed);
      }
    }
    
    setInputBuffer('');
    setActiveTeam(null);
    hiddenInputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setInputBuffer(value);

    console.log('Input change event - value:', value, 'activeTeam:', activeTeam);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitInput();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setInputBuffer('');
      setActiveTeam(null);
      hiddenInputRef.current?.blur();
    }
  };

  const handleScoreClick = (team: 't1' | 't2') => {
    if (readOnly) return;
    setInputBuffer('');
    setActiveTeam(team);
  };

  return (
    <div className="scoreboard">
      <input
        ref={hiddenInputRef}
        className="scoreboard-input"
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Set score"
        value={inputBuffer}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
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