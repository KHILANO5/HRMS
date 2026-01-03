import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import ChangePasswordFirstLogin from './pages/auth/ChangePasswordFirstLogin';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AttendancePage from './pages/employee/AttendancePage';
import CheckInsPage from './pages/employee/CheckInsPage';
import LeaveRequestPage from './pages/employee/LeaveRequestPage';
import ProfilePage from './pages/employee/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password-first-login" element={<ChangePasswordFirstLogin />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/attendance" element={<AttendancePage />} />
        <Route path="/employee/check-ins" element={<CheckInsPage />} />
        <Route path="/employee/leave" element={<LeaveRequestPage />} />
        <Route path="/employee/profile" element={<ProfilePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* Add more routes as we build them */}
      </Routes>
    </Router>
  );
}

export default App;
