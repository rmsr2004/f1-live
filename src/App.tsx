import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GrandPrix from './pages/GrandPrixPage';
import StandingsPage from './pages/StandingsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/grandprix/:round" element={<GrandPrix />} />
        <Route path="/standings/:type" element={<StandingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;