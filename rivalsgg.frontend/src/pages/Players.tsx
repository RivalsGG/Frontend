import { useState, useEffect } from 'react';
import { PlayerService, Player } from '../services/api';
import './Players.css';

function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const data = await PlayerService.getAllPlayers();
        setPlayers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('Failed to fetch players');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) return <div className="loading">Loading players...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="players-container" style={{ textAlign: 'left', alignSelf: 'flex-start', width: '100%' }}>
      <h1>Players</h1>
      
      <div className="player-list">
        {players.map(player => (
          <div 
            key={player.playerId} 
            className="player-item"
            style={{ backgroundColor: player.playerColor }}
          >
            <img 
              src={player.playerIcon || 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png'} 
              alt={`${player.playerName}'s icon`}
              className="player-icon"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png';
              }}
            />
            <h3 className="player-name">{player.playerName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;