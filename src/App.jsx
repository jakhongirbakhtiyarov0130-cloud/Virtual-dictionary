import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Composers from './pages/Composers';
import Instruments from './pages/Instruments';
import Quiz from './pages/Quiz';
import FloatingBackground from './components/FloatingBackground';
import './App.css';

// Himoyalangan yo'l (faqat kirganlar uchun)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Yuklanmoqda...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();

  return (
    <LanguageProvider>
      <AuthProvider>
        <FloatingBackground showStickman={location.pathname === '/register' || location.pathname === '/login'} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/composers"
            element={
              <ProtectedRoute>
                <Composers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instruments"
            element={
              <ProtectedRoute>
                <Instruments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
