import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PageLoading from './components/layout/PageLoading';

// Lazy load components for better performance
const ChatApp = lazy(() => import('./components/ChatApp'));
const Settings = lazy(() => import('./components/Settings'));
const LoginApp = lazy(() => import('./loginUI/App'));

// Loading component for Suspense fallback
const LoadingFallback: React.FC = () => (
  <PageLoading fullScreen />
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <ChatApp />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<LoginApp mode="login" />} />
                  <Route path="/signup" element={<LoginApp mode="signup" />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;