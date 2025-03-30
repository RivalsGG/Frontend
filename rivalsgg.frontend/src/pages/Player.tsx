import { useState, useEffect } from 'react';
import { PlayerService, Player } from '../services/api';

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Players</h2>
      <ul>
        {players.map(player => (
          <li key={player.playerId}>
            {player.playerName} - {player.playerColor}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList;