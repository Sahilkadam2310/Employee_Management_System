import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout        from './components/Layout';
import LoginPage     from './pages/LoginPage';
import Dashboard     from './pages/Dashboard';
import EmployeesPage from './pages/EmployeesPage';
import LeavesPage    from './pages/LeavesPage';
import MyProfilePage from './pages/MyProfilePage';
import NotFound      from './pages/NotFound';
import './index.css';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ROLE_ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<ProtectedRoute adminOnly><EmployeesPage /></ProtectedRoute>} />
        <Route path="leaves"    element={<LeavesPage />} />
        <Route path="profile"   element={<MyProfilePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1e28',
              color: '#f0f2f7',
              border: '1px solid #ffffff18',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#0c0e12' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#0c0e12' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}