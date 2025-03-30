import React from 'react';
import Header from '../components/Header.tsx';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  
  return (
    <div className="landing-page">
      <div className="overlay"></div>
      <div className="content">
        <Header 
          title="RivalsGG" 
          subtitle="Gaming hub for the new hit Marvel shooter" 
        />
        <main>
          <section>
          <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => navigate('/players')}
      >
        View Players
      </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;