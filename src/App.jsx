import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { PresentationPage } from './pages/PresentationPage';
import { PlayerPage } from './pages/PlayerPage';

function Home() {
  return (
    <main className="layout">
      <h1>Live Question Deck</h1>
      <p>Public, no-auth, mobile-first question flow with real-time sync.</p>
      <div className="buttonRow">
        <Link to="/admin" className="btn">Question Editor</Link>
        <Link to="/presentation" className="btn">Presentation Screen</Link>
        <Link to="/play" className="btn">Participant View</Link>
      </div>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/presentation" element={<PresentationPage />} />
      <Route path="/play" element={<PlayerPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
