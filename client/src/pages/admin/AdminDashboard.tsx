import { useState, useEffect } from 'react';
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
    FileText,
    Loader2
} from 'lucide-react';
import dashboardService, { type AdminDashboardStats } from '../../services/dashboardService';
import authService from '../../services/authService';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getAdminStats();
            setStats(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
            setError(errorMessage);
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="card p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
                    <p className="text-gray-600 mb-6">{error || 'Unable to fetch dashboard data'}</p>
                    <button onClick={fetchDashboardStats} className="btn-primary">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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
                            <p className="text-sm text-gray-600">Welcome back, {user?.email || 'Admin'}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                to="/admin/profile"
                                className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                                    <span className="font-bold text-xs">{user?.email?.[0]?.toUpperCase() || 'A'}</span>
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-medium">{user?.email || 'Admin User'}</p>
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
                                {stats.recentLeaveRequests.length > 0 ? (
                                    stats.recentLeaveRequests.map((request) => (
                                        <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{request.employeeName}</h4>
                                                    <p className="text-sm text-gray-600">{request.employeeCode} • {request.department}</p>
                                                </div>
                                                <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                                                    {request.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span>{request.leaveType}</span>
                                                <span>•</span>
                                                <span>{new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{request.numberOfDays} days</span>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-2">{request.reason}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No pending leave requests</p>
                                    </div>
                                )}
                            </div>

                            <Link to="/admin/leave" className="block mt-4 text-center text-sm text-purple-600 hover:text-purple-700 font-semibold">
                                View All Leave Requests →
                            </Link>
                        </div>

                        {/* Recent Employees */}
                        <div className="card p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Recent Employees</h3>
                            </div>

                            <div className="space-y-4">
                                {stats.recentEmployees.length > 0 ? (
                                    stats.recentEmployees.map((employee) => (
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
                                                <span>Joined {new Date(employee.dateOfJoining).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{employee.employeeCode}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No recent employees</p>
                                    </div>
                                )}
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
