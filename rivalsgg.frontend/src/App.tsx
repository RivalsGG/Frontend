import './App.css';
import HomePage from './pages/HomePage';
import PlayerList from './pages/Players';
import MarvelHeroes from './pages/MarvelHeroes';
import HeroDetail from './pages/HeroDetail';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayerList />} />
        <Route path="/heroes" element={<MarvelHeroes />} />
        <Route path="/heroes/:id" element={<HeroDetail />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App
