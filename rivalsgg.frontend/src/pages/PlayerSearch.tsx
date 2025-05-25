import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerNameService } from '../services/api';
import './PlayerSearch.css';

function PlayerSearch() {
  const [uid, setUid] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uid.trim()) {
      setError('Please enter a UID');
      return;
    }

    if (!/^\d+$/.test(uid)) {
      setError('UID must contain only numbers');
      return;
    }

    try {
      setSearching(true);
      setError(null);
      
      const response = await PlayerNameService.getPlayerNameByUid(uid);
      
      if (response.username) {
        navigate(`/playerstats/${uid}`);
      } else {
        setError('Player not found');
      }
    } catch (err) {
      console.error('Error searching for player:', err);
      setError('Player not found or error occurred');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="player-lookup-container">
      <h2>Player Lookup</h2>
      <p>Search for a player by their UID</p>
      
      <form onSubmit={handleSearch} className="lookup-form">
        <div className="input-group">
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Enter player UID"
            className="uid-input"
            disabled={searching}
          />
          <button 
            type="submit" 
            disabled={searching}
            className="search-button"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default PlayerSearch;