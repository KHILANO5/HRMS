import { Link } from 'react-router-dom';
import { Building2, LogOut, Shield } from 'lucide-react';

export default function AdminDashboard() {
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Dayflow HRMS</h1>
                                <p className="text-xs text-gray-600">Admin Portal</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="card p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome, {user.name || 'Admin'}! 👑
                    </h1>

                    <p className="text-xl text-gray-600 mb-8">
                        You've successfully logged in to the Admin Dashboard
                    </p>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 max-w-2xl mx-auto">
                        <p className="text-sm text-purple-900 font-medium mb-3">🚧 Dashboard Under Construction</p>
                        <p className="text-sm text-purple-700">
                            The admin dashboard with employee management, leave approvals, and reporting features is being built.
                            This is a placeholder page to demonstrate successful admin login.
                        </p>
                    </div>

                    <div className="mt-8 flex justify-center space-x-4">
                        <Link to="/" className="btn-secondary">
                            Back to Home
                        </Link>
                        <button onClick={handleLogout} className="btn-primary">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
