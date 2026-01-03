import { Link } from 'react-router-dom';
import {
    Users,
    Calendar,
    Clock,
    TrendingUp,
    Shield,
    Zap,
    CheckCircle,
    ArrowRight,
    Building2
} from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-gradient">Dayflow</span>
                                <p className="text-xs text-gray-600">Human Resource Management</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="btn-primary flex items-center space-x-2"
                            >
                                <span>Employee Login</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Text Content */}
                        <div className="animate-fade-in">
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
                                <span className="text-blue-600 font-semibold text-sm">✨ Internal HR Portal</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                Welcome to
                                <span className="text-gradient block mt-2">Dayflow HRMS</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Your centralized platform for employee management, attendance tracking, leave requests,
                                and HR operations. Everything you need, all in one place.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link to="/login" className="btn-primary text-center">
                                    Access Portal
                                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                                </Link>
                                <a href="#features" className="btn-secondary text-center">
                                    Learn More
                                </a>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-blue-600">248</div>
                                    <div className="text-sm text-gray-600 mt-1">Employees</div>
                                </div>
                                <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-green-600">94%</div>
                                    <div className="text-sm text-gray-600 mt-1">Attendance</div>
                                </div>
                                <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-purple-600">8</div>
                                    <div className="text-sm text-gray-600 mt-1">Pending</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Dashboard Preview */}
                        <div className="relative animate-slide-up">
                            <div className="relative z-10">
                                <div className="card p-8 card-hover">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Today's Overview</h3>
                                            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600">Total Employees</div>
                                                    <div className="text-2xl font-bold text-gray-900">248</div>
                                                </div>
                                            </div>
                                            <div className="text-green-600 font-semibold text-sm">Active</div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600">Present Today</div>
                                                    <div className="text-2xl font-bold text-gray-900">234</div>
                                                </div>
                                            </div>
                                            <div className="text-blue-600 font-semibold text-sm">94.4%</div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600">Leave Requests</div>
                                                    <div className="text-2xl font-bold text-gray-900">8</div>
                                                </div>
                                            </div>
                                            <div className="text-purple-600 font-semibold text-sm">Pending</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 blur-2xl animate-float"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Portal Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Comprehensive tools for employees and HR administrators
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 - Employee Management */}
                        <div className="card p-8 card-hover group">
                            <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Employee Directory</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Complete employee profiles with personal information, department details, and contact information.
                            </p>
                            <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>View all employees</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Department-wise listing</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Profile management</span>
                                </li>
                            </ul>
                        </div>

                        {/* Feature 2 - Attendance */}
                        <div className="card p-8 card-hover group">
                            <div className="w-14 h-14 gradient-success rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Attendance Tracking</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Monitor daily attendance with check-in/out times, work hours, and monthly summaries.
                            </p>
                            <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Daily attendance records</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Work hours calculation</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Monthly reports</span>
                                </li>
                            </ul>
                        </div>

                        {/* Feature 3 - Leave Management */}
                        <div className="card p-8 card-hover group">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Calendar className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Leave Management</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Submit leave requests, track balances, and manage approvals seamlessly.
                            </p>
                            <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Request paid/sick leave</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Track leave balance</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Admin approval workflow</span>
                                </li>
                            </ul>
                        </div>

                        {/* Feature 4 - Profile Management */}
                        <div className="card p-8 card-hover group">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Profile</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Manage your personal information, emergency contacts, and view salary details.
                            </p>
                            <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Update contact info</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Emergency contacts</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Salary information</span>
                                </li>
                            </ul>
                        </div>

                        {/* Feature 5 - Admin Controls */}
                        <div className="card p-8 card-hover group">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Admin Dashboard</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Comprehensive admin tools for employee onboarding, leave approvals, and reporting.
                            </p>
                            <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Add new employees</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Approve/reject leaves</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Generate reports</span>
                                </li>
                            </ul>
                        </div>

                        {/* Feature 6 - Security */}
                        <div className="card p-8 card-hover group">
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Reliable</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Role-based access control ensures data privacy and security for all users.
                            </p>
                            <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Encrypted passwords</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Role-based permissions</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Audit logging</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* User Roles Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Two User Roles
                        </h2>
                        <p className="text-xl text-gray-600">
                            Tailored experiences for employees and administrators
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Employee Role */}
                        <div className="card p-8">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Employee</h3>
                                    <p className="text-gray-600">Self-service portal</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">View personal profile and salary info</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Check attendance records and work hours</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Submit leave requests (paid/sick)</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">View leave balance and history</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Update contact and address information</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">View other employees (limited info)</span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Role */}
                        <div className="card p-8 border-2 border-blue-200">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Admin / HR</h3>
                                    <p className="text-gray-600">Full management access</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Add and manage all employees</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">View and edit all employee profiles</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Approve or reject leave requests</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Manage salary structures and components</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">View attendance reports for all employees</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Generate auto-login credentials for new hires</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="card p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 gradient-primary opacity-5"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Ready to access the portal?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Log in with your employee credentials to get started.
                            </p>
                            <Link to="/login" className="btn-primary inline-flex items-center space-x-2">
                                <span>Go to Login</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <p className="text-sm text-gray-500 mt-6">
                                New employee? Your admin will provide you with login credentials.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold">Dayflow</span>
                                    <p className="text-xs text-gray-400">HRMS Portal</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm max-w-md">
                                Internal Human Resource Management System for streamlined employee management,
                                attendance tracking, and leave administration.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/login" className="hover:text-white transition-colors">Employee Login</Link></li>
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contact HR</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="mailto:hr@company.com" className="hover:text-white transition-colors">hr@company.com</a></li>
                                <li><a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a></li>
                                <li className="text-gray-500">Mon-Fri, 9AM-6PM</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Dayflow HRMS. All rights reserved. Internal use only.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
