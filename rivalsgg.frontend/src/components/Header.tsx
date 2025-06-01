import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlayerNameService } from '../services/api';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './Login';
import Logout from './Logout';
import './Header.css';

type HeaderProps = {

  showNavigation?: boolean;
  showSearch?: boolean;
};

const Header: React.FC<HeaderProps> = ({ 
 showNavigation = false, 
  showSearch = false 
}) => {
  const [uid, setUid] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth0();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid.trim()) {
      setError('Please enter a UID');
      return;
    }

    if (!/^\d+$/.test(uid)) {
      setError('UID can only be numbers');
      return;
    }

    try {
      setSearching(true);
      setError(null);
      
      const response = await PlayerNameService.getPlayerNameByUid(uid);
      if (response.username) {
        navigate(`/playerstats/${uid}`);
        setUid('');
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

  const clearError = () => {
    setError(null);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

 return (
  <>
    <header className={`header ${showNavigation ? 'header-with-nav' : ''}`}>
      <div className="header-container">
        {showNavigation && (
          <div className="brand" onClick={() => navigate('/')}>
            <h1>RivalsGG</h1>
          </div>
        )}

        {showNavigation && (
          <nav className="nav-links">
            <button 
              className={`nav-button ${isActive('/heroes') ? 'active' : ''}`}
              onClick={() => navigate('/heroes')}
            >
              Heroes
            </button>
            <button 
              className={`nav-button ${isActive('/players') ? 'active' : ''}`}
              onClick={() => navigate('/players')}
            >
              Players
            </button>
          </nav>
        )}

        {showSearch && (
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className={`search-input-group : ''}`}>
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => {
                    setUid(e.target.value);
                    clearError();
                  }}
                  placeholder="Search by UID"
                  className="search-input"
                  disabled={searching}
                />
                <button 
                  type="submit" 
                  disabled={searching || !uid.trim()}
                  className="search-button"
                >
                  🔍
                </button>
              </div>
            </form>
          </div>
        )}
        {showNavigation && !isLoading && (
  <div className="auth-section">
    {isAuthenticated ? (
      <div className="user-section">
        <span>Hello, {user?.name}!</span>
        <Logout />
      </div>
    ) : (
      <Login />
    )}
  </div>
)}
      </div>
    </header>
    
  
    {showSearch && error && (
      <div className="search-error-external">
        {error}
      </div>
    )}
  </>
);
}
export default Header;