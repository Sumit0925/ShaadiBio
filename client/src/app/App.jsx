import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, logout } from '../features/auth/authSlice';
import Navbar from '../components/layout/Navbar';
import { Footer } from '../components/shared';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/HomePage';
import { LoginPage, RegisterPage } from '../features/auth/AuthPages';
import CreateBiodata from '../features/biodata/CreateBiodata';
import Dashboard from '../pages/Dashboard';
import PreviewPage from '../pages/PreviewPage';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function NoNavLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(s => s.auth);

  // Validate stored token on app load
  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
    }
  }, [token, dispatch]);

  // Listen for 401 events from axios interceptor
  useEffect(() => {
    const handler = () => dispatch(logout());
    window.addEventListener('sb:unauthorized', handler);
    return () => window.removeEventListener('sb:unauthorized', handler);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no navbar */}
        <Route path="/login" element={<NoNavLayout><LoginPage /></NoNavLayout>} />
        <Route path="/register" element={<NoNavLayout><RegisterPage /></NoNavLayout>} />

        {/* Main pages with navbar */}
        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
        <Route path="/create" element={<AppLayout><CreateBiodata /></AppLayout>} />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout><CreateBiodata /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview/:id"
          element={
            <ProtectedRoute>
              <PreviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
