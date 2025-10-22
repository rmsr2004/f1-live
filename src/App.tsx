import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import { registerDevice } from './services/notification';

import HomePage from './pages/HomePage';
import GrandPrix from './pages/GrandPrixPage';
import StandingsPage from './pages/StandingsPage';
import './App.css';

function App() {
    useEffect(() => {
        registerDevice();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="grandprix/:round" element={<GrandPrix />} />
                <Route path="standings/:type" element={<StandingsPage />} />
            </Routes>
        </Router>
    );
}

export default App;