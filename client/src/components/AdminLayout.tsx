import { type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Shield,
    Users,
    Calendar,
    Clock,
    LogOut,
    Menu,
    X,
    BarChart3,
    FileText
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Employees', path: '/admin/employees' },
        { icon: Clock, label: 'Attendance', path: '/admin/attendance' },
        { icon: Calendar, label: 'Leave Management', path: '/admin/leave' },
        { icon: FileText, label: 'Reports', path: '/admin/reports' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-30`}>
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
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
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
            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
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

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
