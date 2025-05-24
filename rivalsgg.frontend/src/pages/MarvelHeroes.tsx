import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarvelHeroService, MarvelHero } from '../services/api';
import './MarvelHeroes.css';

const IMAGE_BASE_URL = 'https://marvelrivalsapi.com';

function MarvelHeroes() {
    const [heroes, setHeroes] = useState<MarvelHero[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHeroes = async () => {
            try {
                setLoading(true);
                const data = await MarvelHeroService.getAllHeroes();
                setHeroes(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching heroes:', err);
                setError('Failed to fetch heroes');
            } finally {
                setLoading(false);
            }
        };

        fetchHeroes();
    }, []);
    const handleHeroClick = (heroId: string) => {
        navigate(`/heroes/${heroId}`);
      };

    if (loading) return <div className="loading">Loading heroes...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="heroes-container">
            <div className="heroes-header">
                <h1>Marvel Heroes</h1>
            </div>

            <div className="hero-grid">
                {heroes.map(hero => (
                    <div
                        key={hero.id}
                        className="hero-card"
                        onClick={() => handleHeroClick(hero.id)}
                    >
                        <div className="hero-image-container">
                            <img
                                src={`${IMAGE_BASE_URL}${hero.imageUrl}`}
                                alt={`${hero.name}`}
                                className="hero-image"
                                onError={(e) => {
                                    console.log(`Image failed to load: ${(e.target as HTMLImageElement).src}`);
                                    (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png';
                                }}
                            />
                        </div>
                        <div className="hero-details">
                            <h3 className="hero-name">{hero.name}</h3>
                            <div className="hero-role">
                                <span className={`role-badge ${hero.role}`}>
                                    {hero.role}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MarvelHeroes;