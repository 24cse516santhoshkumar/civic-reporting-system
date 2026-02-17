import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import IssueDetail from './pages/IssueDetail';
import UsersList from './pages/UsersList';
import UserProfile from './pages/UserProfile';
import CreateReport from './pages/CreateReport';
import About from './pages/About';
import Reports from './pages/Reports';

import ProtectedRoute from './components/ProtectedRoute';
import Debug from './pages/Debug';
import Monitor from './pages/Monitor';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
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
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-report"
          element={
            <ProtectedRoute allowedRoles={['CITIZEN']}>
              <CreateReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id"
          element={
            <ProtectedRoute>
              <IssueDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'OFFICIAL']}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route path="/debug" element={<Debug />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/monitor"
          element={
            <ProtectedRoute>
              <Monitor />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
