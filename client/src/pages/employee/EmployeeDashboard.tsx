import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Calendar,
    Clock,
    FileText,
    User,
    LogOut,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Building2,
    Menu,
    X,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import dashboardService, { type EmployeeDashboardStats } from '../../services/dashboardService';
import authService from '../../services/authService';

// Formatters
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
};

export default function EmployeeDashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getEmployeeStats();
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

    // Format stats for display
    const displayStats = [
        {
            label: 'Monthly Attendance',
            value: `${stats.monthlyAttendance.percentage}%`,
            subtext: `${stats.monthlyAttendance.presentDays}/${stats.monthlyAttendance.presentDays + stats.monthlyAttendance.absentDays} Days Present`,
            icon: CheckCircle2,
            color: 'text-green-600',
            bg: 'bg-green-100'
        },
        {
            label: 'Paid Leave',
            value: stats.leaveBalance.paid.remaining.toString(),
            subtext: `${stats.leaveBalance.paid.used} Used of ${stats.leaveBalance.paid.total}`,
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-100'
        },
        {
            label: 'Sick Leave',
            value: stats.leaveBalance.sick.remaining.toString(),
            subtext: `${stats.leaveBalance.sick.used} Used of ${stats.leaveBalance.sick.total}`,
            icon: AlertCircle,
            color: 'text-orange-600',
            bg: 'bg-orange-100'
        },
        {
            label: 'Check-in Status',
            value: stats.checkInStatus.checkedIn ? 'Checked In' : 'Not Checked In',
            subtext: stats.checkInStatus.checkInTime || 'No check-in today',
            icon: Clock,
            color: stats.checkInStatus.checkedIn ? 'text-green-600' : 'text-gray-600',
            bg: stats.checkInStatus.checkedIn ? 'bg-green-100' : 'bg-gray-100'
        }
    ];

    // Get recent leave requests from stats
    const recentLeaves = stats.recentLeaveRequests || [];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    {/* Logo */}
                    <Link to="/employee/dashboard" className="h-16 flex items-center px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Dayflow
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 px-3 space-y-1">
                        <NavItem
                            to="/employee/dashboard"
                            icon={LayoutDashboard}
                            label="Dashboard"
                        />
                        <NavItem
                            to="/employee/check-ins"
                            icon={User}
                            label="Employees"
                        />
                        <NavItem
                            to="/employee/attendance"
                            icon={Calendar}
                            label="My Attendance"
                            active={window.location.pathname === '/employee/attendance'}
                        />
                        <NavItem
                            to="/employee/leave"
                            icon={FileText}
                            label="Leave Request"
                        />
                    </nav>

                    {/* User Profile in Sidebar - REMOVED */}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex items-center justify-between ml-4 lg:ml-0">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-sm text-gray-500 hidden sm:block">Welcome back, {user.name || 'Employee'}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link to="/employee/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'Employee'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email || 'employee@dayflow.com'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                                    {user.name ? user.name.charAt(0) : 'E'}
                                </div>
                            </Link>
                            <div className="h-8 w-px bg-gray-200 mx-2"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {/* Quick Actions / Web Check-In */}
                    <div className="mb-8">
                        <CheckInWidget />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {displayStats.map((stat, index) => (
                            <div key={index} className="card p-6 flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                    <span className="text-xs text-gray-400">{stat.subtext}</span>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Recent Leaves */}
                        <div>
                            <div className="card h-full">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">Recent Leave Requests</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {recentLeaves.map((leave) => (
                                            <div key={leave.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${leave.leaveType === 'paid' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                                        }`}>
                                                        {leave.leaveType === 'paid' ? <Calendar className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{leave.leaveType === 'paid' ? 'Paid Leave' : 'Sick Leave'}</h4>
                                                        <p className="text-sm text-gray-500">{leave.startDate} to {leave.endDate} • {leave.numberOfDays} days</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${leave.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    leave.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                    }`}>
                                                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                                </span>
                                            </div>
                                        ))}
                                        {recentLeaves.length === 0 && (
                                            <p className="text-center text-gray-500 py-4">No recent leave requests</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ to, icon: Icon, label, active = false }: { to: string, icon: any, label: string, active?: boolean }) {
    return (
        <Link
            to={to}
            className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                ${active
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
            `}
        >
            <Icon className={`w-5 h-5 mr-3 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
            {label}
        </Link>
    );
}

function CheckInWidget() {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [timer, setTimer] = useState('00:00:00');

    // Timer logic
    useEffect(() => {
        let interval: any;
        if (isCheckedIn) {
            const startTime = new Date(); // In a real app, this should be the saved CheckIn time
            interval = setInterval(() => {
                const now = new Date();
                const diff = now.getTime() - startTime.getTime();
                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setTimer(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
            }, 1000);
        } else {
            setTimer('00:00:00');
        }
        return () => clearInterval(interval);
    }, [isCheckedIn]);

    const handleCheckIn = () => {
        const now = new Date();
        setCheckInTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        setIsCheckedIn(true);
    };

    const handleCheckOut = () => {
        setIsCheckedIn(false);
        setCheckInTime(null);
    };

    return (
        <div className="card p-6 border-l-4 border-blue-500 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-white to-blue-50">
            <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${isCheckedIn ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Clock className={`w-8 h-8 ${isCheckedIn ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {isCheckedIn ? 'You are checked in' : 'Not checked in yet'}
                    </h2>
                    <p className="text-gray-500">
                        {isCheckedIn ? `Since ${checkInTime}` : 'Mark your attendance for today'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {isCheckedIn && (
                    <div className="text-center hidden sm:block">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Work Timer</p>
                        <p className="text-2xl font-mono font-bold text-gray-900">{timer}</p>
                    </div>
                )}

                <button
                    onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                    className={`
                        px-8 py-3 rounded-lg font-bold shadow-lg transform transition-all duration-200 active:scale-95 flex items-center gap-2
                        ${isCheckedIn
                            ? 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:-translate-y-0.5'
                        }
                    `}
                >
                    {isCheckedIn ? (
                        <>
                            <LogOut className="w-5 h-5" />
                            Check Out
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Check In
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}



