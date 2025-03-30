import './App.css';
import HomePage from './pages/HomePage';
import PlayerList from './pages/Player';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayerList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
