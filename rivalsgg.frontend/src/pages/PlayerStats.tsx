import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RivalsPlayerStatsService, RivalsPlayerStats } from '../services/api';
import './PlayerStats.css';

const IMAGE_BASE_URL = 'https://marvelrivalsapi.com';

function PlayerStats() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<RivalsPlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (uid) {
      fetchPlayerStats(uid);
    }
  }, [uid]);

  const fetchPlayerStats = async (playerUid: string) => {
    try {
      setLoading(true);
      const data = await RivalsPlayerStatsService.getPlayerStats(playerUid);
      console.log('Player stats data:', data); // Debug log
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching player stats:', err);
      setError('Failed to fetch player stats. Player might not exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStats = async () => {
    if (!uid) return;
    
    try {
      setUpdating(true);
      const response = await RivalsPlayerStatsService.requestPlayerUpdate(uid);
      
      if (response.success) {
        alert('Player data update requested successfully!');
        setTimeout(() => fetchPlayerStats(uid), 2000);
      } else {
        alert(`Update failed: ${response.message}`);
      }
    } catch (err) {
      console.error('Error updating player stats:', err);
      alert('Failed to request player update');
    } finally {
      setUpdating(false);
    }
  };

  const getWinrateColor = (winrate: number): string => {
    if (winrate >= 0.6) return '#4CAF50';
    if (winrate >= 0.5) return '#FFC107';
    return '#f44336';
  };

  const getRankColor = (rank: string): string => {
    const rankColors: { [key: string]: string } = {
      'bronze': '#CD7F32',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
      'platinum': '#E5E4E2',
      'diamond': '#B9F2FF',
      'master': '#FF4500',
      'grandmaster': '#9B30FF',
      'eternity': '#FF1493'
    };
    
    const lowerRank = rank.toLowerCase();
    for (const [key, color] of Object.entries(rankColors)) {
      if (lowerRank.includes(key)) return color;
    }
    return '#FFFFFF';
  };

  if (loading) return <div className="loading">Loading player stats...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div className="error">No player data found</div>;

  const winratePercentage = (stats.winrate * 100).toFixed(2);

  return (
    <div className="player-stats-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="player-header">
        <div className="player-avatar-section">
          {(() => {
            console.log('Player object:', stats.player);
            console.log('Icon object:', stats.player?.icon);
            
            const iconUrl = (stats.player?.icon as any)?.player_icon || stats.player?.icon?.iconUrl;
            console.log('Icon URL:', iconUrl);
            
            if (iconUrl) {
              const fullIconUrl = `${IMAGE_BASE_URL}/rivals${iconUrl}`;
              console.log('Full icon URL:', fullIconUrl);
              
              return (
                <img 
                  src={fullIconUrl}
                  alt={stats.name}
                  className="player-avatar"
                  onLoad={() => {
                    console.log('Player icon loaded successfully:', fullIconUrl);
                  }}
                  onError={(e) => {
                    console.error('Failed to load player icon:', fullIconUrl);
                    console.error('Player icon object:', stats.player?.icon);
                    (e.target as HTMLImageElement).src = 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg';
                  }}
                />
              );
            } else {
              console.log('No icon URL found, showing placeholder');
              return (
                <div className="player-avatar-placeholder">
                  <span>👤</span>
                </div>
              );
            }
          })()}
        </div>
        
        <div className="player-info">
          <h1>{stats.name}</h1>
          <div className="player-meta">
            <span className="uid">UID: {stats.uid}</span>
            <span className="level">Level {stats.level || 0}</span>
            {stats.rank && (
              <span 
                className="rank"
                style={{ color: getRankColor(stats.rank) }}
              >
                {stats.rank}
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={handleUpdateStats}
          disabled={updating}
          className="update-button"
        >
          {updating ? 'Updating...' : 'Update Stats'}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Matches</h3>
          <p className="stat-value">{stats.matches || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Wins</h3>
          <p className="stat-value wins">{stats.wins || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Losses</h3>
          <p className="stat-value losses">{stats.losses || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Win Rate</h3>
          <p 
            className="stat-value"
            style={{ color: getWinrateColor(stats.winrate || 0) }}
          >
            {winratePercentage}%
          </p>
        </div>
      </div>

      {stats.isPrivate && (
        <div className="private-notice">
          This player's profile is private. 
        </div>
      )}
    </div>
  );
}

export default PlayerStats;