import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayerService,  } from '../services/api';
import './PlayerForm.css';
import { useAuth0 } from '@auth0/auth0-react';

interface PlayerFormData {
  playerName: string;
  playerIcon: string;
  playerColor: string;
}
 

const PlayerForm: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState<PlayerFormData>({
    playerName: '',
    playerIcon: '',
    playerColor: '#ff0000'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEdit && id) {
      fetchPlayer(parseInt(id));
    }
  }, [isEdit, id]);

  const fetchPlayer = async (playerId: number) => {
    try {
      setLoading(true);
      const player = await PlayerService.getPlayer(playerId);
      setFormData({
        playerName: player.playerName,
        playerIcon: player.playerIcon,
        playerColor: player.playerColor
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching player:', err);
      setError('Failed to fetch player data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.playerName.trim()) {
      errors.playerName = 'Player name is required';
    } else if (formData.playerName.length < 2 || formData.playerName.length > 20) {
      errors.playerName = 'Player name must be between 2 and 20 characters';
    } else if (!/^[a-zA-Z0-9\s_-]+$/.test(formData.playerName)) {
      errors.playerName = 'Player name can only contain letters, numbers, spaces, underscores, and hyphens';
    }

    if (formData.playerIcon && !/^https?:\/\/.+\..+/.test(formData.playerIcon)) {
      errors.playerIcon = 'Please enter a valid URL for the icon';
    }

    if (!formData.playerColor || !/^#[0-9A-Fa-f]{6}$/.test(formData.playerColor)) {
      errors.playerColor = 'Please enter a valid hex color';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEdit && id) {
        await PlayerService.updatePlayer(parseInt(id), {
          playerId: parseInt(id),
          playerName: formData.playerName,
          playerAuthId: '',
          playerIcon: formData.playerIcon,
          playerColor: formData.playerColor
        });
      } else {
        await PlayerService.createPlayer({
          playerName: formData.playerName,
          playerAuthId: '',
          playerIcon: formData.playerIcon,
          playerColor: formData.playerColor
        });
      }

      navigate('/players');
    } catch (err) {
      console.error('Error saving player:', err);
      setError(isEdit ? 'Failed to update player' : 'Failed to create player');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PlayerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>You must be logged in to create or edit players.</p>
        <button onClick={() => navigate('/players')}>
          Back to Players
        </button>
      </div>
    );
  }

  return (
    <div className="player-form-container">
      <button onClick={() => navigate('/players')} className="back-button">
        ← Back to Players
      </button>

      <div className="form-wrapper">
        <h1>{isEdit ? 'Edit Player' : 'Create New Player'}</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="player-form">
          <div className="form-group">
            <label htmlFor="playerName">Player Name</label>
            <input
              id="playerName"
              type="text"
              value={formData.playerName}
              onChange={(e) => handleInputChange('playerName', e.target.value)}
              className={`form-input ${validationErrors.playerName ? 'error' : ''}`}
              placeholder="Enter player name"
              disabled={loading}
              maxLength={20}
            />
            {validationErrors.playerName && (
              <span className="field-error">{validationErrors.playerName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="playerIcon">Player Icon URL</label>
            <input
              id="playerIcon"
              type="url"
              value={formData.playerIcon}
              onChange={(e) => handleInputChange('playerIcon', e.target.value)}
              className={`form-input ${validationErrors.playerIcon ? 'error' : ''}`}
              placeholder="https://example.com/icon.png"
              disabled={loading}
            />
            {validationErrors.playerIcon && (
              <span className="field-error">{validationErrors.playerIcon}</span>
            )}
            {formData.playerIcon && (
              <div className="icon-preview">
                <img 
                  src={formData.playerIcon} 
                  alt="Icon preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.display = 'block';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="playerColor">Player Color *</label>
            <div className="color-input-group">
              <input
                id="playerColor"
                type="color"
                value={formData.playerColor}
                onChange={(e) => handleInputChange('playerColor', e.target.value)}
                className="color-picker"
                disabled={loading}
              />
              <input
                type="text"
                value={formData.playerColor}
                onChange={(e) => handleInputChange('playerColor', e.target.value)}
                className={`form-input color-text ${validationErrors.playerColor ? 'error' : ''}`}
                placeholder="#ff0000"
                disabled={loading}
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
            {validationErrors.playerColor && (
              <span className="field-error">{validationErrors.playerColor}</span>
            )}
          </div>

          <div className="player-preview">
            <h3>Preview</h3>
            <div 
              className="preview-card"
              style={{ backgroundColor: formData.playerColor }}
            >
              <img 
                src={formData.playerIcon || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4rpeVpR85UeqieekWg_tXCSXKqtCQatFClQ&s'}
                alt="Player preview"
                className="preview-icon"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4rpeVpR85UeqieekWg_tXCSXKqtCQatFClQ&s';
                }}
              />
              <span className="preview-name">{formData.playerName || 'Player Name'}</span>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/players')}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Player' : 'Create Player')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerForm;