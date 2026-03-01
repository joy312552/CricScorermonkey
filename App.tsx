
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Scorer } from './pages/Scorer';
import { Scoreboard } from './pages/Scoreboard';
import { Overlay } from './pages/Overlay';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { CreateMatch } from './pages/CreateMatch';
import { Profile } from './pages/Profile';
import { Teams } from './pages/Teams';
import { Tournaments } from './pages/Tournaments';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Landing - Publicly Accessible */}
            <Route path="/" element={<Home />} />
            
            {/* Public Auth Routes - Blocked for logged-in users */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            
            {/* Viewer Routes - Always Public */}
            <Route path="/scoreboard/:id" element={<Scoreboard />} />
            <Route path="/live/:id" element={<Scoreboard />} />
            <Route path="/overlay/:id" element={<Overlay />} />

            {/* Scorer/Private Routes - Guarded */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/create-match" element={
              <ProtectedRoute>
                <CreateMatch />
              </ProtectedRoute>
            } />
            <Route path="/scorer/:id" element={
              <ProtectedRoute>
                <Scorer />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            } />
            <Route path="/tournaments" element={
              <ProtectedRoute>
                <Tournaments />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
