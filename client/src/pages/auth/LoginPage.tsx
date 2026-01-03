import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Building2,
    AlertCircle,
    Loader2,
    Info,
    Copy,
    Check
} from 'lucide-react';
import authService from '../../services/authService';

// Dummy credentials for testing - UPDATED TO MATCH BACKEND
const DUMMY_USERS = {
    admin: {
        email: 'admin@dayflow.com',
        password: 'Password@123',
        role: 'admin' as const,
        isFirstLogin: false,
        user: {
            id: 'admin-001',
            email: 'admin@dayflow.com',
            role: 'admin' as const,
            name: 'Admin User'
        }
    },
    employee: {
        email: 'john.doe@dayflow.com',
        password: 'Password@123',
        role: 'employee' as const,
        isFirstLogin: false,
        user: {
            id: 'emp-001',
            email: 'john.doe@dayflow.com',
            role: 'employee' as const,
            name: 'John Doe'
        }
    }
};

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCredentials, setShowCredentials] = useState(true);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const fillCredentials = (userType: 'admin' | 'employee') => {
        const user = DUMMY_USERS[userType];
        setFormData({
            email: user.email,
            password: user.password
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            setIsLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            // Call real API login
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });

            // Check if first-time login
            if (response.user.isFirstLogin) {
                navigate('/change-password-first-login');
            } else {
                // Redirect based on role
                if (response.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/employee/dashboard');
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-10 blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <Link to="/" className="inline-flex items-center justify-center space-x-3 mb-4">
                        <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-gradient">Dayflow</h1>
                            <p className="text-sm text-gray-600">HRMS Portal</p>
                        </div>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900 mt-6">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to access your account</p>
                </div>

                {/* Demo Credentials Box */}
                {showCredentials && (
                    <div className="card p-6 mb-6 animate-slide-up border-2 border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-900">Demo Credentials</h3>
                            </div>
                            <button
                                onClick={() => setShowCredentials(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Admin Credentials */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-purple-900">Admin Account</p>
                                    <button
                                        onClick={() => fillCredentials('admin')}
                                        className="text-xs px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                    >
                                        Auto-fill
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between bg-white rounded px-3 py-2">
                                        <span className="text-sm text-gray-600 font-mono">{DUMMY_USERS.admin.email}</span>
                                        <button
                                            onClick={() => copyToClipboard(DUMMY_USERS.admin.email, 'admin-email')}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            {copiedField === 'admin-email' ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between bg-white rounded px-3 py-2">
                                        <span className="text-sm text-gray-600 font-mono">{DUMMY_USERS.admin.password}</span>
                                        <button
                                            onClick={() => copyToClipboard(DUMMY_USERS.admin.password, 'admin-pass')}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            {copiedField === 'admin-pass' ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Employee Credentials */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-blue-900">Employee Account</p>
                                    <button
                                        onClick={() => fillCredentials('employee')}
                                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Auto-fill
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between bg-white rounded px-3 py-2">
                                        <span className="text-sm text-gray-600 font-mono">{DUMMY_USERS.employee.email}</span>
                                        <button
                                            onClick={() => copyToClipboard(DUMMY_USERS.employee.email, 'emp-email')}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            {copiedField === 'emp-email' ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between bg-white rounded px-3 py-2">
                                        <span className="text-sm text-gray-600 font-mono">{DUMMY_USERS.employee.password}</span>
                                        <button
                                            onClick={() => copyToClipboard(DUMMY_USERS.employee.password, 'emp-pass')}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            {copiedField === 'emp-pass' ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Login Card */}
                <div className="card p-8 animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-fade-in">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-red-800 font-medium">Login Failed</p>
                                    <p className="text-sm text-red-600 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field pl-12"
                                    placeholder="you@company.com"
                                    required
                                    autoComplete="email"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field pl-12 pr-12"
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors"
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">New employee?</span>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <p className="text-sm text-blue-800 text-center">
                            Your HR administrator will provide you with login credentials.
                            <br />
                            <span className="font-medium">Contact HR if you need assistance.</span>
                        </p>
                    </div>
                </div>

                {/* Show Credentials Button */}
                {!showCredentials && (
                    <div className="text-center mt-4">
                        <button
                            onClick={() => setShowCredentials(true)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Show Demo Credentials
                        </button>
                    </div>
                )}

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center space-x-1"
                    >
                        <span>← Back to Home</span>
                    </Link>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-8 text-xs text-gray-500">
                    <p>By signing in, you agree to our internal policies and data protection guidelines.</p>
                </div>
            </div>
        </div>
    );
}
