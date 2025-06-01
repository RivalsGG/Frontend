import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerService, Player } from '../services/api';
import './Players.css';
import { useAuth0 } from '@auth0/auth0-react';

function PlayerList() {
  const { isAuthenticated } = useAuth0();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
  }, []);

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

  const handleDeletePlayer = async (playerId: number, playerName: string) => {
    if (!isAuthenticated) {
      alert('You must be logged in to delete players');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete player "${playerName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(playerId);
      await PlayerService.deletePlayer(playerId);
      await fetchPlayers(); 
    } catch (err) {
      console.error('Error deleting player:', err);
      alert('Failed to delete player. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditPlayer = (playerId: number) => {
    if (!isAuthenticated) {
      alert('You must be logged in to edit players');
      return;
    }
    navigate(`/players/edit/${playerId}`);
  };

  if (loading) return <div className="loading">Loading players...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="players-container">
      <div className="players-header">
        <h1>Players</h1>
        {isAuthenticated && (
          <button 
            className="add-player-button"
            onClick={() => navigate('/players/new')}
          >
            + Add New Player
          </button>
        )}
      </div>
      
      {players.length === 0 ? (
        <div className="no-players">
          <p>No players found. Create your first player!</p>
          {isAuthenticated && (
            <button 
              className="create-first-button"
              onClick={() => navigate('/players/new')}
            >
              Create First Player
            </button>
          )}
        </div>
      ) : (
        <div className="player-list">
          {players.map(player => (
            <div 
              key={player.playerId} 
              className="player-item"
              style={{ backgroundColor: player.playerColor }}
            >
              <img 
                src={player.playerIcon || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4rpeVpR85UeqieekWg_tXCSXKqtCQatFClQ&s'} 
                alt={`${player.playerName}'s icon`}
                className="player-icon"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4rpeVpR85UeqieekWg_tXCSXKqtCQatFClQ&s';
                }}
              />
              <div className="player-info">
                <h3 className="player-name">{player.playerName}</h3>
              </div>
              
              <div className="player-actions">
                {isAuthenticated && (
                  <>
                    <button 
                      className="edit-button"
                      onClick={() => handleEditPlayer(player.playerId)}
                      title="Edit Player"
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeletePlayer(player.playerId, player.playerName)}
                      disabled={deletingId === player.playerId}
                      title="Delete Player"
                    >
                      {deletingId === player.playerId ? '⏳' : '🗑️'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayerList;