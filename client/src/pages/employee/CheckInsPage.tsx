import { useState } from 'react';
import {
    LayoutDashboard,
    Calendar,
    User,
    FileText,
    LogOut,
    Bell,
    Building2,
    Menu,
    Search,
    Filter,
    MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Mock Data for Employees (README Section 6.3)
    const employees = [
        {
            id: 1,
            name: 'Sarah Williams',
            designation: 'Product Designer',
            department: 'Design',
            status: 'Present',
            checkInTime: '09:05 AM',
            image: '' // Placeholder for avatar
        },
        {
            id: 2,
            name: 'Michael Chen',
            designation: 'Senior Developer',
            department: 'Engineering',
            status: 'Present',
            checkInTime: '08:55 AM',
            image: ''
        },
        {
            id: 3,
            name: 'Jessica Davis',
            designation: 'HR Manager',
            department: 'HR',
            status: 'On Leave',
            leaveType: 'Sick Leave',
            image: ''
        },
        {
            id: 4,
            name: 'David Wilson',
            designation: 'Marketing Lead',
            department: 'Marketing',
            status: 'Absent',
            image: ''
        },
        {
            id: 5,
            name: 'Priya Patel',
            designation: 'Frontend Developer',
            department: 'Engineering',
            status: 'Present',
            checkInTime: '09:30 AM',
            image: ''
        },
        {
            id: 6,
            name: 'James Rodriguez',
            designation: 'Sales Executive',
            department: 'Sales',
            status: 'Present',
            checkInTime: '09:12 AM',
            image: ''
        }
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Present':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">Present</span>;
            case 'On Leave':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">On Leave</span>;
            case 'Absent':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">Absent</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">Unknown</span>;
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
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Dayflow
                        </span>
                    </div>

                    <nav className="flex-1 py-6 px-3 space-y-1">
                        <NavItem to="/employee/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem to="/employee/check-ins" icon={User} label="Check-ins" active />
                        <NavItem to="/employee/attendance" icon={Calendar} label="My Attendance" />
                        <NavItem to="/employee/leave" icon={FileText} label="Leave Request" />
                        <NavItem to="/employee/profile" icon={User} label="My Profile" />
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center p-2 rounded-lg bg-gray-50">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {user.name ? user.name.charAt(0) : 'E'}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'Employee'}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email || 'employee@dayflow.com'}</p>
                            </div>
                        </div>
                    </div>
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
                        <h1 className="text-2xl font-bold text-gray-900">Team Check-ins</h1>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
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
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                            <span>Filter by Dept</span>
                        </button>
                    </div>

                    {/* Employee Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employees.map((emp) => (
                            <div key={emp.id} className="card hover:shadow-lg transition-shadow duration-200">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-bold text-gray-900">{emp.name}</h3>
                                                <p className="text-xs text-gray-500">{emp.designation}</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(emp.status)}
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Department</span>
                                            <span className="font-medium text-gray-900">{emp.department}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Location</span>
                                            <div className="flex items-center text-gray-900">
                                                <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                                <span className="font-medium">Office</span>
                                            </div>
                                        </div>
                                        {emp.status === 'Present' && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Check-in</span>
                                                <span className="font-medium text-green-600">{emp.checkInTime}</span>
                                            </div>
                                        )}
                                        {emp.status === 'On Leave' && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Reason</span>
                                                <span className="font-medium text-orange-600">{emp.leaveType}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
