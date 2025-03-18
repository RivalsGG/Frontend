import React from 'react';
import Header from '../components/Header.tsx';
import './HomePage.css';

const HomePage: React.FC = () => {
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
            
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;