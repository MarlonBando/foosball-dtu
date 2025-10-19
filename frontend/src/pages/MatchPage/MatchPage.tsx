import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import FoosballTable from '../../components/FoosballTable/FoosballTable';
import Player from '../../components/Player/Player';
import Scoreboard from '../../components/Scoreboard/Scoreboard';
import PlayerSelectionModal from '../../components/PlayerSelectionModal/PlayerSelectionModal';
import PageLayout from '../../components/PageLayout/PageLayout';
import './MatchPage.css';
import type { Match, Player as PlayerType } from '../../types';
import { PlayerStatus, MatchStatus } from '../../types';

// Mock Data as requested
const mockPlayer1: PlayerType = { id: 1, created_at: new Date().toISOString(), username: 'johndoe', elo: 1200, name: 'John', surname: 'Doe', nationality: 1, wins: 10, losses: 5 };
const mockPlayer2: PlayerType = { id: 2, created_at: new Date().toISOString(), username: 'janedoe', elo: 1250, name: 'Jane', surname: 'Doe', nationality: 2, wins: 12, losses: 8 };
const mockPlayer3: PlayerType = { id: 3, created_at: new Date().toISOString(), username: 'peterp', elo: 1100, name: 'Peter', surname: 'Pan', nationality: 3, wins: 8, losses: 10 };
const mockPlayer4: PlayerType = { id: 4, created_at: new Date().toISOString(), username: 'maryj', elo: 1300, name: 'Mary', surname: 'Jane', nationality: 4, wins: 15, losses: 6 };
const mockPlayer5: PlayerType = { id: 5, created_at: new Date().toISOString(), username: 'sarahk', elo: 1150, name: 'Sarah', surname: 'K', nationality: 1, wins: 9, losses: 9 };
const mockPlayer6: PlayerType = { id: 6, created_at: new Date().toISOString(), username: 'mikeb', elo: 1050, name: 'Mike', surname: 'B', nationality: 2, wins: 6, losses: 12 };

const mockAllPlayers: PlayerType[] = [
    mockPlayer1, mockPlayer2, mockPlayer3, mockPlayer4, mockPlayer5, mockPlayer6,
    { id: 7, created_at: new Date().toISOString(), username: 'alice', elo: 1350, name: 'Alice', surname: 'A', nationality: 3, wins: 14, losses: 7 },
    { id: 8, created_at: new Date().toISOString(), username: 'bob', elo: 1180, name: 'Bob', surname: 'B', nationality: 4, wins: 11, losses: 9 },
    { id: 9, created_at: new Date().toISOString(), username: 'charlie', elo: 1220, name: 'Charlie', surname: 'C', nationality: 1, wins: 13, losses: 8 },
    { id: 10, created_at: new Date().toISOString(), username: 'diana', elo: 1280, name: 'Diana', surname: 'D', nationality: 2, wins: 12, losses: 6 },
];

type PlayerSlot = 't1_gk' | 't1_st' | 't2_gk' | 't2_st';

const initialMatch: Match = {
    id: null,
    created_at: null,
    t1_gk: null,
    t1_st: null,
    t2_gk: null,
    t2_st: null,
    table: 1,
    t1_score: 0,
    t2_score: 0,
    status: MatchStatus.Pending,
    t1_gk_status: PlayerStatus.Pending,
    t1_st_status: PlayerStatus.Pending,
    t2_gk_status: PlayerStatus.Pending,
    t2_st_status: PlayerStatus.Pending,
};

const mockMatches: Match[] = [
    {
        id: 1,
        created_at: new Date().toISOString(),
        t1_gk: mockPlayer1,
        t1_st: mockPlayer2,
        t2_gk: mockPlayer3,
        t2_st: mockPlayer4,
        table: 1,
        t1_score: 10,
        t2_score: 8,
        status: MatchStatus.Completed,
        t1_gk_status: PlayerStatus.Accepted,
        t1_st_status: PlayerStatus.Accepted,
        t2_gk_status: PlayerStatus.Accepted,
        t2_st_status: PlayerStatus.Accepted,
    },
    {
        id: 2,
        created_at: new Date().toISOString(),
        t1_gk: mockPlayer5,
        t1_st: mockPlayer6,
        t2_gk: mockPlayer1,
        t2_st: mockPlayer3,
        table: 1,
        t1_score: 5,
        t2_score: 10,
        status: MatchStatus.Completed,
        t1_gk_status: PlayerStatus.Accepted,
        t1_st_status: PlayerStatus.Accepted,
        t2_gk_status: PlayerStatus.Accepted,
        t2_st_status: PlayerStatus.Accepted,
    }
];

const currentUserId = 2; // We are mockPlayer2

const MatchPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const readOnly = location.state?.readOnly || false;

    const [match, setMatch] = useState<Match>(initialMatch);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState<PlayerSlot | null>(null);

    useEffect(() => {
        if (id) {
            const existingMatch = mockMatches.find(m => m.id === parseInt(id));
            if (existingMatch) {
                setMatch(existingMatch);
            }
        } else {
            setMatch(initialMatch);
        }
    }, [id]);

    const handleScoreChange = (team: 't1' | 't2', delta: 1 | -1) => {
        if (readOnly) return;
        setMatch(prevMatch => {
            const currentScore = team === 't1' ? prevMatch.t1_score : prevMatch.t2_score;
            const newScore = currentScore + delta;
            if (newScore < 0 || newScore > 10) return prevMatch;
            if (team === 't1') return { ...prevMatch, t1_score: newScore };
            else return { ...prevMatch, t2_score: newScore };
        });
    };

    const handlePlayerClick = (slot: PlayerSlot) => {
        if (readOnly) return;
        setCurrentSlot(slot);
        setIsModalOpen(true);
    };

    const handleSelectPlayer = (player: PlayerType) => {
        if (currentSlot) {
            setMatch(prevMatch => ({ ...prevMatch, [currentSlot]: player }));
        }
        setIsModalOpen(false);
        setCurrentSlot(null);
    };

    const handleAcceptMatch = (slot: PlayerSlot) => {
        if (readOnly) return;
        console.log(`Player in slot ${slot} accepted the match.`);
        setMatch(prevMatch => {
            const newMatch = { ...prevMatch };
            switch (slot) {
                case 't1_gk': newMatch.t1_gk_status = PlayerStatus.Accepted; break;
                case 't1_st': newMatch.t1_st_status = PlayerStatus.Accepted; break;
                case 't2_gk': newMatch.t2_gk_status = PlayerStatus.Accepted; break;
                case 't2_st': newMatch.t2_st_status = PlayerStatus.Accepted; break;
            }
            return newMatch;
        });
    };

    const registerMatch = () => {
        const apiPayload = {
            t1_gk: match.t1_gk?.id,
            t1_st: match.t1_st?.id,
            t2_gk: match.t2_gk?.id,
            t2_st: match.t2_st?.id,
            table: match.table,
            t1_score: match.t1_score,
            t2_score: match.t2_score,
        };
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
                        readOnly={readOnly}
                    />
                </div>
                <div className="game-area">
                    <FoosballTable />
                    <div className="team team-left">
                        <Player
                            player={match.t1_gk}
                            status={match.status}
                            playerStatus={match.t1_gk_status}
                            isCurrentUser={match.t1_gk?.id === currentUserId}
                            onAccept={() => handleAcceptMatch('t1_gk')}
                            onClick={() => handlePlayerClick('t1_gk')}
                            readOnly={readOnly}
                        />
                        <Player
                            player={match.t1_st}
                            status={match.status}
                            playerStatus={match.t1_st_status}
                            isCurrentUser={match.t1_st?.id === currentUserId}
                            onAccept={() => handleAcceptMatch('t1_st')}
                            onClick={() => handlePlayerClick('t1_st')}
                            readOnly={readOnly}
                        />
                    </div>
                    <div className="team team-right">
                        <Player
                            player={match.t2_gk}
                            status={match.status}
                            playerStatus={match.t2_gk_status}
                            isCurrentUser={match.t2_gk?.id === currentUserId}
                            onAccept={() => handleAcceptMatch('t2_gk')}
                            onClick={() => handlePlayerClick('t2_gk')}
                            readOnly={readOnly}
                        />
                        <Player
                            player={match.t2_st}
                            status={match.status}
                            playerStatus={match.t2_st_status}
                            isCurrentUser={match.t2_st?.id === currentUserId}
                            onAccept={() => handleAcceptMatch('t2_st')}
                            onClick={() => handlePlayerClick('t2_st')}
                            readOnly={readOnly}
                        />
                    </div>
                </div>
                {!readOnly && (
                    <button className="register-match-button" onClick={registerMatch}>
                        Register Match
                    </button>
                )}
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