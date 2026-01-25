import React from 'react';
import './PlayerHeader.css';
import type { Player } from '../../types';

interface PlayerHeaderProps {
    player: Player;
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ player }) => {
    return (
        <div className="player-header">
            <div className="player-header-card">
                <h1 className="player-header-name">{player.username}</h1>
                <div className="player-elo">
                    <span className="elo-label">ELO Rating</span>
                    <span className="elo-value">{player.elo}</span>
                </div>
                <div className="player-record">
                    <div className="record-item wins">
                        <span className="record-value">{player.wins}</span>
                        <span className="record-label">Wins</span>
                    </div>
                    <div className="record-divider">-</div>
                    <div className="record-item losses">
                        <span className="record-value">{player.losses}</span>
                        <span className="record-label">Losses</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerHeader;
