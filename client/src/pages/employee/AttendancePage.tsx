import { useState } from 'react';
import {
    Calendar,
    Search,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    LayoutDashboard,
    User,
    FileText,
    LogOut,
    Building2,
    Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Formatters
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    }).format(date);
};

interface NavItemProps {
    to: string;
    icon: any;
    label: string;
    active?: boolean;
}

const NavItem = ({ to, icon: Icon, label, active = false }: NavItemProps) => (
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

export default function AttendancePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
    };

    // Mock Data (Expanded for demonstration)
    const attendanceRecords = [
        // January 2026
        { date: '2026-01-15', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', extraHours: '0h 00m', status: 'Present', type: 'On-Time' },
        { date: '2026-01-14', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', extraHours: '0h 00m', status: 'Present', type: 'On-Time' },
        { date: '2026-01-13', checkIn: '09:10 AM', checkOut: '06:10 PM', hours: '9h 00m', extraHours: '0h 00m', status: 'Present', type: 'Late Entry' },
        { date: '2026-01-12', checkIn: '-', checkOut: '-', hours: '0h 00m', extraHours: '0h 00m', status: 'Absent', type: 'Sick Leave' },
        { date: '2026-01-11', checkIn: '-', checkOut: '-', hours: '0h 00m', extraHours: '0h 00m', status: 'Weekend', type: 'Weekend' },
        { date: '2026-01-10', checkIn: '-', checkOut: '-', hours: '0h 00m', extraHours: '0h 00m', status: 'Weekend', type: 'Weekend' },
        { date: '2026-01-09', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', extraHours: '0h 00m', status: 'Present', type: 'On-Time' },
        { date: '2026-01-08', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', extraHours: '0h 00m', status: 'Present', type: 'On-Time' },
        { date: '2026-01-07', checkIn: '08:55 AM', checkOut: '06:00 PM', hours: '9h 05m', extraHours: '0h 00m', status: 'Present', type: 'On-Time' },
        { date: '2026-01-06', checkIn: '09:00 AM', checkOut: '07:00 PM', hours: '10h 00m', extraHours: '1h 00m', status: 'Present', type: 'On-Time' },
        { date: '2026-01-05', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', extraHours: '0h 00m', status: 'Present', type: 'On-Time' },
        { date: '2026-01-02', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', extraHours: '0h 00m', status: 'Present', type: 'On-Time' },
        { date: '2026-01-01', checkIn: '09:15 AM', checkOut: '06:15 PM', hours: '9h 00m', extraHours: '0h 00m', status: 'Present', type: 'Late Entry' },

        // December 2025
        { date: '2025-12-31', checkIn: '09:00 AM', checkOut: '02:00 PM', hours: '5h 00m', extraHours: '0h 00m', status: 'Half Day', type: 'Early Exit' },
        { date: '2025-12-30', checkIn: '-', checkOut: '-', hours: '0h 00m', extraHours: '0h 00m', status: 'Absent', type: 'Casual Leave' },
        { date: '2025-12-29', checkIn: '08:55 AM', checkOut: '06:05 PM', hours: '9h 10m', extraHours: '0h 10m', status: 'Present', type: 'On-Time' },
        { date: '2025-12-26', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', extraHours: '0h 00m', status: 'Present', type: 'On-Time' },
        { date: '2025-12-25', checkIn: '-', checkOut: '-', hours: '0h 00m', extraHours: '0h 00m', status: 'Holiday', type: 'Christmas' },
    ];

    // Filter records by Current Month
    const currentMonthRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth.getMonth() &&
            recordDate.getFullYear() === currentMonth.getFullYear();
    });

    // Calculate Stats Dynamically
    const stats = {
        totalDays: currentMonthRecords.filter(r => r.status !== 'Weekend' && r.status !== 'Holiday').length,
        daysPresent: currentMonthRecords.filter(r => r.status === 'Present' || r.status === 'Half Day').length,
        daysAbsent: currentMonthRecords.filter(r => r.status === 'Absent').length, // Absent without leave or specialized status
        leaves: currentMonthRecords.filter(r => r.type.includes('Leave')).length
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-700';
            case 'Absent': return 'bg-red-100 text-red-700';
            case 'Half Day': return 'bg-orange-100 text-orange-700';
            case 'Holiday': return 'bg-purple-100 text-purple-700';
            case 'Weekend': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

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
                            active
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
                            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
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

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {/* Header Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Link to="/employee/dashboard" className="text-gray-400 hover:text-gray-600">
                                    Dashboard
                                </Link>
                                <span className="text-gray-400">/</span>
                                <h2 className="text-lg font-semibold text-gray-700">My Attendance</h2>
                            </div>
                            <p className="text-gray-500">Track your daily attendance and work hours</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="btn-secondary flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export Report
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="card p-4">
                            <p className="text-sm text-gray-500 mb-1">Total Working Days</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalDays}</h3>
                        </div>
                        <div className="card p-4 border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 mb-1">Days Present</p>
                            <h3 className="text-2xl font-bold text-green-600">{stats.daysPresent}</h3>
                        </div>
                        <div className="card p-4 border-l-4 border-red-500">
                            <p className="text-sm text-gray-500 mb-1">Days Absent</p>
                            <h3 className="text-2xl font-bold text-red-600">{stats.daysAbsent}</h3>
                        </div>
                        <div className="card p-4 border-l-4 border-blue-500">
                            <p className="text-sm text-gray-500 mb-1">Leaves Taken</p>
                            <h3 className="text-2xl font-bold text-blue-600">{stats.leaves}</h3>
                        </div>
                    </div>

                    {/* Attendance Table Card */}
                    <div className="card">
                        {/* Filters & Month Selector */}
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h2 className="text-lg font-bold text-gray-900 min-w-[170px] text-center">
                                    {formatDate(currentMonth)}
                                </h2>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by date..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-64"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Work Hours</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Extra Hours</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentMonthRecords.map((record, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                                                        <Calendar className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {new Date(record.date).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                    {record.checkIn}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                    {record.checkOut}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-medium text-gray-900">{record.hours}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-medium text-gray-600">{record.extraHours}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / Pagination */}
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                            <p>Showing 5 of 24 records</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
                                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
