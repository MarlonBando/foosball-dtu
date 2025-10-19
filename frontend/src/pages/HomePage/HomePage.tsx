import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import MatchHistoryTable from '../../components/MatchHistoryTable/MatchHistoryTable';
import './HomePage.css';
import type { Player, Match } from '../../types';

// Mock Data - will be replaced with actual data from props/API
const mockPlayer: Player = {
    id: 1,
    created_at: new Date().toISOString(),
    username: 'johndoe',
    elo: 1450,
    name: 'John',
    surname: 'Doe',
    nationality: 1,
    wins: 24,
    losses: 18,
};

const mockMatches: Match[] = [
    {
        id: 1,
        created_at: '2025-10-19T10:30:00Z',
        t1_gk: { id: 1, created_at: '', username: 'johndoe', elo: 1450, name: 'John', surname: 'Doe', nationality: 1, wins: 24, losses: 18 },
        t1_st: { id: 2, created_at: '', username: 'janedoe', elo: 1380, name: 'Jane', surname: 'Doe', nationality: 2, wins: 20, losses: 15 },
        t2_gk: { id: 3, created_at: '', username: 'peterp', elo: 1200, name: 'Peter', surname: 'Pan', nationality: 3, wins: 12, losses: 20 },
        t2_st: { id: 4, created_at: '', username: 'maryj', elo: 1500, name: 'Mary', surname: 'Jane', nationality: 4, wins: 28, losses: 10 },
        table: 1,
        t1_score: 10,
        t2_score: 7,
        status: 'completed',
    },
    {
        id: 2,
        created_at: '2025-10-18T15:45:00Z',
        t1_gk: { id: 5, created_at: '', username: 'alice', elo: 1350, name: 'Alice', surname: 'A', nationality: 1, wins: 15, losses: 12 },
        t1_st: { id: 6, created_at: '', username: 'bob', elo: 1280, name: 'Bob', surname: 'B', nationality: 2, wins: 18, losses: 16 },
        t2_gk: { id: 1, created_at: '', username: 'johndoe', elo: 1450, name: 'John', surname: 'Doe', nationality: 1, wins: 24, losses: 18 },
        t2_st: { id: 7, created_at: '', username: 'charlie', elo: 1420, name: 'Charlie', surname: 'C', nationality: 3, wins: 22, losses: 14 },
        table: 2,
        t1_score: 10,
        t2_score: 6,
        status: 'completed',
    },
    {
        id: 3,
        created_at: '2025-10-17T12:00:00Z',
        t1_gk: { id: 1, created_at: '', username: 'johndoe', elo: 1450, name: 'John', surname: 'Doe', nationality: 1, wins: 24, losses: 18 },
        t1_st: { id: 8, created_at: '', username: 'diana', elo: 1380, name: 'Diana', surname: 'D', nationality: 4, wins: 19, losses: 13 },
        t2_gk: { id: 9, created_at: '', username: 'emily', elo: 1290, name: 'Emily', surname: 'E', nationality: 1, wins: 16, losses: 18 },
        t2_st: { id: 10, created_at: '', username: 'frank', elo: 1320, name: 'Frank', surname: 'F', nationality: 2, wins: 17, losses: 15 },
        table: 1,
        t1_score: 0,
        t2_score: 0,
        status: 'accepted',
    },
    {
        id: 4,
        created_at: '2025-10-16T09:30:00Z',
        t1_gk: { id: 11, created_at: '', username: 'george', elo: 1400, name: 'George', surname: 'G', nationality: 3, wins: 20, losses: 16 },
        t1_st: { id: 12, created_at: '', username: 'helen', elo: 1350, name: 'Helen', surname: 'H', nationality: 4, wins: 18, losses: 17 },
        t2_gk: { id: 1, created_at: '', username: 'johndoe', elo: 1450, name: 'John', surname: 'Doe', nationality: 1, wins: 24, losses: 18 },
        t2_st: { id: 13, created_at: '', username: 'ivan', elo: 1380, name: 'Ivan', surname: 'I', nationality: 1, wins: 19, losses: 14 },
        table: 2,
        t1_score: 0,
        t2_score: 0,
        status: 'pending',
    },
];

const HomePage: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>(mockMatches);

    const handleAcceptMatch = (matchId: number) => {
        setMatches(prevMatches =>
            prevMatches.map(match =>
                match.id === matchId ? { ...match, status: 'accepted' as const } : match
            )
        );
        console.log(`Match ${matchId} accepted`);
    };

    return (
        <PageLayout variant="full" backgroundColor="#ffffff">
            <div className="home-page">
                <PlayerHeader player={mockPlayer} />
                <MatchHistoryTable
                    matches={matches}
                    currentPlayerId={mockPlayer.id}
                    onAcceptMatch={handleAcceptMatch}
                />
            </div>
        </PageLayout>
    );
};

export default HomePage;
