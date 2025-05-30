import './App.css';
import HomePage from './pages/HomePage';
import PlayerList from './pages/Players';
import PlayerForm from './pages/PlayerForm';
import MarvelHeroes from './pages/MarvelHeroes';
import HeroDetail from './pages/HeroDetail';
import PlayerStats from './pages/PlayerStats';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Header 
        showNavigation={true}
        showSearch={true}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayerList />} />
        <Route path="/players/new" element={<PlayerForm />} />
        <Route path="/players/edit/:id" element={<PlayerForm />} />
        <Route path="/heroes" element={<MarvelHeroes />} />
        <Route path="/heroes/:id" element={<HeroDetail />} />
        <Route path="/playerstats/:uid" element={<PlayerStats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App