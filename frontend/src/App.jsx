import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import PersonnelPage from './pages/PersonnelPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import ReportsPage from './pages/ReportsPage';

function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Добовий наряд інституту
        </Typography>
        <Button color="inherit" component={NavLink} to="/">Головна</Button>
        <Button color="inherit" component={NavLink} to="/calendar">Календар</Button>
        <Button color="inherit" component={NavLink} to="/personnel">Особовий склад</Button>
        <Button color="inherit" component={NavLink} to="/reports">Доповіді</Button>
        <Button color="inherit" onClick={logout}>Вихід</Button>
      </Toolbar>
    </AppBar>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? (
    <Box>
      <Navbar />
      {children}
    </Box>
  ) : (
    <Navigate to="/login" />
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
      >
        <Routes location={location}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/personnel" element={<ProtectedRoute><PersonnelPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}