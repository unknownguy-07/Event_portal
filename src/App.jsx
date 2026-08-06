import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { EventProvider } from '@/context/EventContext';
import { LandingPage } from '@/pages/LandingPage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
