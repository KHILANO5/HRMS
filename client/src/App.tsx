import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import ChangePasswordFirstLogin from './pages/auth/ChangePasswordFirstLogin';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeAttendancePage from './pages/employee/AttendancePage';
import CheckInsPage from './pages/employee/CheckInsPage';
import LeaveRequestPage from './pages/employee/LeaveRequestPage';
import ProfilePage from './pages/employee/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeesPage from './pages/admin/EmployeesPage';
import AddEmployeePage from './pages/admin/AddEmployeePage';
import ViewEmployeePage from './pages/admin/ViewEmployeePage';
import EditSalaryPage from './pages/admin/EditSalaryPage';
import AdminAttendancePage from './pages/admin/AttendancePage';
import LeavePage from './pages/admin/LeavePage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password-first-login" element={<ChangePasswordFirstLogin />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/attendance" element={<EmployeeAttendancePage />} />
        <Route path="/employee/check-ins" element={<CheckInsPage />} />
        <Route path="/employee/leave" element={<LeaveRequestPage />} />
        <Route path="/employee/profile" element={<ProfilePage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<EmployeesPage />} />
        <Route path="/admin/employees/add" element={<AddEmployeePage />} />
        <Route path="/admin/employees/:id" element={<ViewEmployeePage />} />
        <Route path="/admin/employees/:id/edit-salary" element={<EditSalaryPage />} />
        <Route path="/admin/attendance" element={<AdminAttendancePage />} />
        <Route path="/admin/leave" element={<LeavePage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />

        {/* Add more routes as we build them */}
      </Routes>
    </Router>
  );
}


export default App;
