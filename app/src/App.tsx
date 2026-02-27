import { Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell';
import { ExperiencePage } from './pages/ExperiencePage';
import { HomePage } from './pages/HomePage';
import { ThoughtEntryPage } from './pages/ThoughtEntryPage';
import { ThoughtsPage } from './pages/ThoughtsPage';

export function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/experience/" element={<ExperiencePage />} />
        <Route path="/thoughts/" element={<ThoughtsPage />} />
        <Route path="/thoughts/:slug/" element={<ThoughtEntryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
