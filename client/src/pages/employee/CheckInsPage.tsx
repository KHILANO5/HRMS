import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Calendar,
    User,
    FileText,
    LogOut,
    Building2,
    Menu,
    Search,
    Filter,
    MapPin,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import attendanceService from '../../services/attendanceService';

// Reusing NavItem for consistency
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

export default function CheckInsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchTodayAttendance();
    }, []);

    const fetchTodayAttendance = async () => {
        try {
            setLoading(true);
            const today = new Date().toISOString().split('T')[0];
            // Use getAllAttendance which calls /attendance/ - backend will return records based on user role
            const data = await attendanceService.getAllAttendance({
                startDate: today,
                endDate: today
            });
            setAttendanceData(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch attendance';
            setError(errorMessage);
            console.error('Error fetching attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Filter attendance data based on search
    const filteredEmployees = attendanceData.filter(record =>
        record.employee?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.employee?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.employee?.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'present':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">Present</span>;
            case 'leave':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">On Leave</span>;
            case 'absent':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">Absent</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">Unknown</span>;
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
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
                    <Link to="/employee/dashboard" className="h-16 flex items-center px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Dayflow
                        </span>
                    </Link>

                    <nav className="flex-1 py-6 px-3 space-y-1">
                        <NavItem to="/employee/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem to="/employee/check-ins" icon={User} label="Employees" active />
                        <NavItem to="/employee/attendance" icon={Calendar} label="My Attendance" />
                        <NavItem to="/employee/leave" icon={FileText} label="Leave Request" />
                    </nav>

                    {/* User Profile in Sidebar - REMOVED */}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex items-center justify-between ml-4 lg:ml-0">
                        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
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
                            <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {/* Filters */}
                    <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-96">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                            <span>Filter by Dept</span>
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="card p-6 bg-red-50 border-red-200">
                            <div className="flex items-center space-x-3">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                                <div>
                                    <p className="font-semibold text-red-900">Failed to load attendance</p>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                            <button onClick={fetchTodayAttendance} className="btn-primary mt-4">
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Employee Grid */}
                    {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEmployees.map((record) => (
                                <div key={record.id} className="card hover:shadow-lg transition-shadow duration-200">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                    {getInitials(record.employee?.firstName || '', record.employee?.lastName || '')}
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-bold text-gray-900">
                                                        {record.employee?.firstName} {record.employee?.lastName}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">{record.employee?.designation || 'N/A'}</p>
                                                </div>
                                            </div>
                                            {getStatusBadge(record.status)}
                                        </div>

                                        <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Department</span>
                                                <span className="font-medium text-gray-900">{record.employee?.department || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Location</span>
                                                <div className="flex items-center text-gray-900">
                                                    <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                                    <span className="font-medium">Office</span>
                                                </div>
                                            </div>
                                            {record.status.toLowerCase() === 'present' && record.checkInTime && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Check-in</span>
                                                    <span className="font-medium text-green-600">
                                                        {new Date(record.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            )}
                                            {record.status.toLowerCase() === 'leave' && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Reason</span>
                                                    <span className="font-medium text-orange-600">On Leave</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500">No attendance records found for today</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
