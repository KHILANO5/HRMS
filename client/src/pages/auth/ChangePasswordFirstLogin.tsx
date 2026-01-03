import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Lock,
    Eye,
    EyeOff,
    Building2,
    AlertCircle,
    CheckCircle,
    Loader2,
    Shield
} from 'lucide-react';

export default function ChangePasswordFirstLogin() {
    const navigate = useNavigate();
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear errors when user starts typing
        if (error) setError('');
        if (validationErrors.length > 0) setValidationErrors([]);
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords({
            ...showPasswords,
            [field]: !showPasswords[field]
        });
    };

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);
        setIsLoading(true);

        // Validation
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required');
            setIsLoading(false);
            return;
        }

        // Validate new password strength
        const passwordErrors = validatePassword(formData.newPassword);
        if (passwordErrors.length > 0) {
            setValidationErrors(passwordErrors);
            setIsLoading(false);
            return;
        }

        // Check if passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            setIsLoading(false);
            return;
        }

        // Check if new password is different from current
        if (formData.currentPassword === formData.newPassword) {
            setError('New password must be different from current password');
            setIsLoading(false);
            return;
        }

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/v1/auth/change-password-first-login', {
            //   method: 'POST',
            //   headers: { 
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${localStorage.getItem('tempToken')}`
            //   },
            //   body: JSON.stringify({
            //     currentPassword: formData.currentPassword,
            //     newPassword: formData.newPassword,
            //     confirmPassword: formData.confirmPassword
            //   })
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock success response
            const mockResponse = {
                success: true,
                data: {
                    tokens: {
                        accessToken: 'new_access_token',
                        refreshToken: 'new_refresh_token'
                    }
                }
            };

            if (mockResponse.success) {
                // Store new tokens
                localStorage.setItem('accessToken', mockResponse.data.tokens.accessToken);
                localStorage.removeItem('tempToken');

                // Get user info to determine redirect
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;

                // Show success message briefly then redirect
                setTimeout(() => {
                    if (user?.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/employee/dashboard');
                    }
                }, 1000);
            }
        } catch (err) {
            setError('Failed to change password. Please try again or contact HR.');
            console.error('Password change error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = (password: string): { strength: string; color: string; width: string } => {
        const errors = validatePassword(password);
        if (!password) return { strength: '', color: '', width: '0%' };
        if (errors.length === 0) return { strength: 'Strong', color: 'bg-green-500', width: '100%' };
        if (errors.length <= 2) return { strength: 'Medium', color: 'bg-yellow-500', width: '66%' };
        return { strength: 'Weak', color: 'bg-red-500', width: '33%' };
    };

    const strength = passwordStrength(formData.newPassword);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full opacity-10 blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center space-x-3 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-gradient">Dayflow</h1>
                            <p className="text-sm text-gray-600">HRMS Portal</p>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mt-6">Change Your Password</h2>
                    <p className="text-gray-600 mt-2">First-time login requires a password change</p>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-slide-up">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-900 font-medium">Security Requirement</p>
                            <p className="text-sm text-blue-700 mt-1">
                                For your security, you must change your temporary password before accessing the system.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Password Change Card */}
                <div className="card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-fade-in">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-red-800 font-medium">Error</p>
                                    <p className="text-sm text-red-600 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Validation Errors */}
                        {validationErrors.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fade-in">
                                <p className="text-sm text-yellow-800 font-medium mb-2">Password Requirements:</p>
                                <ul className="space-y-1">
                                    {validationErrors.map((err, index) => (
                                        <li key={index} className="text-sm text-yellow-700 flex items-start space-x-2">
                                            <span className="text-yellow-500 mt-0.5">•</span>
                                            <span>{err}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Current Password Field */}
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Password (Temporary)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="input-field pl-12 pr-12"
                                    placeholder="Enter temporary password"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password Field */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="input-field pl-12 pr-12"
                                    placeholder="Enter new password"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.newPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-600">Password Strength:</span>
                                        <span className={`text-xs font-medium ${strength.strength === 'Strong' ? 'text-green-600' :
                                                strength.strength === 'Medium' ? 'text-yellow-600' :
                                                    'text-red-600'
                                            }`}>
                                            {strength.strength}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                                            style={{ width: strength.width }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-field pl-12 pr-12"
                                    placeholder="Confirm new password"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Match Indicator */}
                            {formData.confirmPassword && (
                                <div className="mt-2 flex items-center space-x-2">
                                    {formData.newPassword === formData.confirmPassword ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span className="text-xs text-green-600 font-medium">Passwords match</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                            <span className="text-xs text-red-600 font-medium">Passwords do not match</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</p>
                            <ul className="space-y-1 text-xs text-gray-600">
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${formData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                                    <span>At least 8 characters long</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${/[A-Z]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                    <span>One uppercase letter</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${/[a-z]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                    <span>One lowercase letter</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${/[0-9]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                    <span>One number</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                    <span>One special character (!@#$%^&*...)</span>
                                </li>
                            </ul>
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
                                    <span>Changing Password...</span>
                                </>
                            ) : (
                                <span>Change Password & Continue</span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-6 text-xs text-gray-500">
                    <p>Need help? Contact your HR administrator</p>
                </div>
            </div>
        </div>
    );
}
