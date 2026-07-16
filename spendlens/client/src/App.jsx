import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuditPage from './pages/AuditPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/audit/:id" element={<AuditPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
