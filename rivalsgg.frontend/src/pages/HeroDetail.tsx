import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MarvelHeroService, MarvelHero } from '../services/api';
import './HeroDetail.css';

const IMAGE_BASE_URL = 'https://marvelrivalsapi.com/';

function HeroDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hero, setHero] = useState<MarvelHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchHeroDetails(id);
    }
  }, [id]);

  const fetchHeroDetails = async (heroId: string) => {
    try {
      setLoading(true);
      const data = await MarvelHeroService.getHero(heroId);
      setHero(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching hero details:', err);
      setError('Failed to fetch hero details');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyStars = (difficulty: string): number => {
    const difficultyMap: { [key: string]: number } = {
      'easy': 1,
      'medium': 2,
      'hard': 3,
      'expert': 4,
      'master': 5
    };
    return difficultyMap[difficulty?.toLowerCase()] || 2;
  };

  const getRoleIcon = (role: string): string => {
    const roleIcons: { [key: string]: string } = {
      'Vanguard': '🛡️',
      'Duelist': '⚔️',
      'Strategist': '💉'
    };
    return roleIcons[role] || '❓';
  };

  if (loading) return <div className="loading">Loading hero details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!hero) return <div className="error">Hero not found</div>;

  return (
    <div className="hero-details-container">
      <button onClick={() => navigate('/heroes')} className="back-button">
        ← Back to Heroes
      </button>

      <div className="hero-header-section">
        <div className="hero-image-wrapper">
          <img
            src={`${IMAGE_BASE_URL}${hero.imageUrl}`}
            alt={hero.name}
            className="hero-detail-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png';
            }}
          />
        </div>
        
        <div className="hero-info-section">
          <h1 className="hero-title">{hero.name}</h1>
          {hero.real_Name && (
            <p className="hero-real-name">Real Name: {hero.real_Name}</p>
          )}
          
          <div className="hero-meta-info">
            <div className="role-section">
              <span className="role-icon">{getRoleIcon(hero.role)}</span>
              <span className={`role-text ${hero.role}`}>{hero.role}</span>
            </div>
            
            {hero.difficulty && (
              <div className="difficulty-section">
                <span className="difficulty-label">Difficulty:</span>
                <div className="difficulty-stars">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`star ${i < getDifficultyStars(hero.difficulty!) ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {hero.team && hero.team.length > 0 && (
            <div className="team-section">
              <h3>Team Affiliations</h3>
              <div className="team-tags">
                {hero.team.map((team, index) => (
                  <span key={index} className="team-tag">{team}</span>
                ))}
              </div>
            </div>
          )}

          {hero.bio && (
            <div className="bio-section">
              <h3>Bio</h3>
              <p>{hero.bio}</p>
            </div>
          )}
          {hero.lore && (
            <div className="lore-section">
              <h3>Lore</h3>
              <p>{hero.lore}</p>
            </div>
          )}
          
        </div>
      </div>
  {hero.abilities && hero.abilities.length > 0 && (
        <div className="hero-skills-section">
          <h2 className="skills-title">Hero Skills</h2>
          <div className="skills-grid">
            {hero.abilities.map((ability, index) => {
             
              console.log(`Full URL: ${IMAGE_BASE_URL}/rivals${ability.icon}`);
              
              return (
                <div key={index} className="skill-card">
                  <div className="skill-header">
                    {ability.icon && ability.icon.trim() !== '' ? (
                      <img 
                        src={`${IMAGE_BASE_URL}/rivals${ability.icon}`}
                        alt={ability.name}
                        className="skill-icon"
                        onError={(e) => {
                          console.error(`Failed to load skill icon: ${IMAGE_BASE_URL}/rivals${ability.icon}`);
                          console.error(`Ability object:`, ability);
                          (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png';
                        }}
                       
                      />
                    ) : (
                      <div className="skill-icon skill-icon-placeholder">
                        <span>🎯</span>
                      </div>
                    )}
                    <div className="skill-info">
                      <h4 className="skill-name">{ability.name}</h4>
                      <span className="skill-type">{ability.type}</span>
                    </div>
                  </div>
                  <p className="skill-description">{ability.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export default HeroDetails;