import { useContext, useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import { theme } from './theme/theme';
import { setCredentials } from './store/authSlice';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityRegisterPage from './pages/ActivityRegisterPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  const { token, tokenData } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
    setIsInitializing(false);
  }, [token, tokenData, dispatch]);

  if (isInitializing) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingSpinner fullScreen message="Initializing app..." />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={token ? <Navigate to="/activities" replace /> : <LoginPage />} 
          />

          {/* Protected Routes */}
          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <ActivitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity/register"
            element={
              <ProtectedRoute>
                <ActivityRegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity/:id"
            element={
              <ProtectedRoute>
                <ActivityDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route 
            path="*" 
            element={<Navigate to={token ? "/activities" : "/login"} replace />} 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App
