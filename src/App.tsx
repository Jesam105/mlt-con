import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Letters from './pages/Letters';
import CarePackages from './pages/CarePackages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MessageProvider>
          <div className="min-h-screen bg-light">
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/letters"
                element={
                  <ProtectedRoute>
                    <Letters />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/care-packages"
                element={
                  <ProtectedRoute>
                    <CarePackages />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </MessageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;