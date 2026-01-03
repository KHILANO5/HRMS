import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Shield,
    Users,
    Calendar,
    Clock,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    LogOut,
    Menu,
    X,
    BarChart3,
    FileText
} from 'lucide-react';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Mock data - Replace with API calls
    const stats = {
        totalEmployees: 248,
        presentToday: 234,
        absentToday: 6,
        onLeaveToday: 8,
        pendingLeaveRequests: 12,
        newEmployeesThisMonth: 5
    };

    const recentLeaveRequests = [
        {
            id: '1',
            employeeId: 'EMP003',
            employeeName: 'John Doe',
            department: 'Finance',
            leaveType: 'Paid Leave',
            startDate: '2026-01-10',
            endDate: '2026-01-12',
            days: 3,
            status: 'pending'
        },
        {
            id: '2',
            employeeId: 'EMP002',
            employeeName: 'Jane Smith',
            department: 'HR',
            leaveType: 'Sick Leave',
            startDate: '2026-01-08',
            endDate: '2026-01-09',
            days: 2,
            status: 'pending'
        },
        {
            id: '3',
            employeeId: 'EMP012',
            employeeName: 'Mike Johnson',
            department: 'IT',
            leaveType: 'Paid Leave',
            startDate: '2026-01-15',
            endDate: '2026-01-20',
            days: 6,
            status: 'pending'
        }
    ];

    const recentEmployees = [
        {
            id: '1',
            name: 'Sarah Williams',
            designation: 'Software Engineer',
            department: 'IT',
            joinDate: '2026-01-02',
            status: 'active'
        },
        {
            id: '2',
            name: 'Robert Brown',
            designation: 'HR Manager',
            department: 'Human Resources',
            joinDate: '2025-12-28',
            status: 'active'
        }
    ];

    const menuItems = [
        { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard', active: true },
        { icon: Users, label: 'Employees', path: '/admin/employees', active: false },
        { icon: Clock, label: 'Attendance', path: '/admin/attendance', active: false },
        { icon: Calendar, label: 'Leave Management', path: '/admin/leave', active: false },
        { icon: FileText, label: 'Reports', path: '/admin/reports', active: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {sidebarOpen ? (
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900">Dayflow</h1>
                                    <p className="text-xs text-gray-600">Admin Portal</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.active
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Toggle Button */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                            <p className="text-sm text-gray-600">Welcome back, {user.name || 'Admin'}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                to="/admin/profile"
                                className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                                    <span className="font-bold text-xs">{user.name ? user.name[0] : 'A'}</span>
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-medium">{user.name || 'Admin User'}</p>
                                    <p className="text-xs opacity-75">My Profile</p>
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Employees */}
                        <div className="card p-6 card-hover">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-sm text-green-600 font-semibold">+{stats.newEmployeesThisMonth} this month</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalEmployees}</h3>
                            <p className="text-sm text-gray-600">Total Employees</p>
                        </div>

                        {/* Present Today */}
                        <div className="card p-6 card-hover">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="text-sm text-gray-600 font-semibold">
                                    {((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.presentToday}</h3>
                            <p className="text-sm text-gray-600">Present Today</p>
                        </div>

                        {/* On Leave */}
                        <div className="card p-6 card-hover">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="text-sm text-gray-600 font-semibold">{stats.absentToday} absent</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.onLeaveToday}</h3>
                            <p className="text-sm text-gray-600">On Leave Today</p>
                        </div>

                        {/* Pending Requests */}
                        <div className="card p-6 card-hover">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-orange-600" />
                                </div>
                                <span className="text-sm text-orange-600 font-semibold">Needs action</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingLeaveRequests}</h3>
                            <p className="text-sm text-gray-600">Pending Leave Requests</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Pending Leave Requests */}
                        <div className="card p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Pending Leave Requests</h3>
                            </div>

                            <div className="space-y-4">
                                {recentLeaveRequests.map((request) => (
                                    <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{request.employeeName}</h4>
                                                <p className="text-sm text-gray-600">{request.leaveType}</p>
                                            </div>
                                            <span className="badge badge-warning">{request.days} days</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                            <span>{new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <Users className="w-4 h-4" />
                                                <span>{request.department}</span>
                                            </div>
                                            <span className="text-gray-500">{request.employeeId}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Employees */}
                        <div className="card p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Recent Employees</h3>
                            </div>

                            <div className="space-y-4">
                                {recentEmployees.map((employee) => (
                                    <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                                                <p className="text-sm text-gray-600">{employee.designation}</p>
                                            </div>
                                            <span className="badge badge-success">Active</span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{employee.department}</span>
                                            </span>
                                            <span>Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Link to="/admin/employees" className="card p-6 card-hover text-center group">
                                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Users className="w-7 h-7 text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Manage Employees</h4>
                                <p className="text-sm text-gray-600">View, add, or edit employee information</p>
                            </Link>

                            <Link to="/admin/attendance" className="card p-6 card-hover text-center group">
                                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Clock className="w-7 h-7 text-green-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">View Attendance</h4>
                                <p className="text-sm text-gray-600">Check attendance records and reports</p>
                            </Link>

                            <Link to="/admin/reports" className="card p-6 card-hover text-center group">
                                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-7 h-7 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Generate Reports</h4>
                                <p className="text-sm text-gray-600">Create detailed HR analytics reports</p>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
