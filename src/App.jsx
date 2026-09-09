import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { EventProvider } from '@/context/EventContext';
import { LandingPage } from '@/pages/LandingPage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { EnrolledEventsPage } from '@/pages/EnrolledEventsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

import { AuthPage } from '@/pages/AuthPage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route path="/signup" element={<AuthPage initialMode="signup" />} />
            <Route
              path="/enrolled"
              element={
                <ProtectedRoute>
                  <EnrolledEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute>
                  <EnrolledEventsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
