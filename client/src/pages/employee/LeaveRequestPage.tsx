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
    Plus,
    X,
    Upload,
    Paperclip
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

export default function LeaveRequestPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Form State
    const [leaveType, setLeaveType] = useState('paid');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Mock Data for Balances (README requirements)
    const leaveBalances = {
        paid: { available: 12, total: 15 },
        sick: { available: 5, total: 7 }
    };

    // Mock Data for Leave History
    const leaveHistory = [
        { id: 1, name: user.name || 'Employee', startDate: '2026-01-10', endDate: '2026-01-12', type: 'Paid Time Off', status: 'Approved' },
        { id: 2, name: user.name || 'Employee', startDate: '2025-12-28', endDate: '2025-12-28', type: 'Sick Time Off', status: 'Rejected' },
    ];

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? diffDays : 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle submission logic mock
        console.log({ leaveType, startDate, endDate, reason, attachment });
        setIsModalOpen(false);
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
                        <NavItem to="/employee/check-ins" icon={User} label="Check-ins" />
                        <NavItem to="/employee/attendance" icon={Calendar} label="My Attendance" />
                        <NavItem to="/employee/leave" icon={FileText} label="Leave Request" active />
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
                        <h1 className="text-2xl font-bold text-gray-900">Time Off</h1>
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
                    {/* Page Title & Action */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 bg-gray-700/5 p-2 rounded w-fit px-4 border-l-4 border-gray-700">Time Off</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            NEW
                        </button>
                    </div>

                    {/* Balances */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-b border-gray-200 py-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-blue-500 font-bold text-lg mb-1">Paid time Off</h3>
                            <p className="text-gray-600">{leaveBalances.paid.available} Days Available</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-blue-400 font-bold text-lg mb-1">Sick time off</h3>
                            <p className="text-gray-600">{leaveBalances.sick.available} Days Available</p>
                        </div>
                    </div>

                    {/* Leave History Table */}
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#1a1a1a] text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-medium">Name</th>
                                        <th className="px-6 py-4 text-sm font-medium">Start Date</th>
                                        <th className="px-6 py-4 text-sm font-medium">End Date</th>
                                        <th className="px-6 py-4 text-sm font-medium">Time off Type</th>
                                        <th className="px-6 py-4 text-sm font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {leaveHistory.map((leave) => (
                                        <tr key={leave.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{leave.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{leave.startDate}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{leave.endDate}</td>
                                            <td className="px-6 py-4 text-sm text-blue-500">{leave.type}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'}
                                                `}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-700 text-gray-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-100">Time off Type Request</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Employee Name */}
                            <div className="grid grid-cols-3 items-center gap-4 text-sm">
                                <label className="text-gray-400">Employee</label>
                                <div className="col-span-2 text-blue-400 font-medium">
                                    [{user.name || 'Employee Name'}]
                                </div>
                            </div>

                            {/* Time off Type */}
                            <div className="grid grid-cols-3 items-center gap-4 text-sm">
                                <label className="text-gray-400">Time off Type</label>
                                <div className="col-span-2">
                                    <select
                                        className="w-full bg-transparent text-blue-400 border-none outline-none focus:ring-0 p-0 font-medium cursor-pointer"
                                        value={leaveType}
                                        onChange={(e) => setLeaveType(e.target.value)}
                                    >
                                        <option value="paid" className="bg-gray-800 text-white">[Paid time off]</option>
                                        <option value="sick" className="bg-gray-800 text-white">[Sick Leave]</option>
                                    </select>
                                </div>
                            </div>

                            {/* Validity Period */}
                            <div className="grid grid-cols-3 items-center gap-4 text-sm">
                                <label className="text-gray-400">Validity Period</label>
                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        type="date"
                                        className="bg-transparent text-blue-400 border-none outline-none p-0 w-32 focus:ring-0 [color-scheme:dark]"
                                        value={startDate}
                                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Min date is Tomorrow
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                    <span className="text-gray-500">To</span>
                                    <input
                                        type="date"
                                        className="bg-transparent text-blue-400 border-none outline-none p-0 w-32 focus:ring-0 [color-scheme:dark]"
                                        value={endDate}
                                        min={startDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]} // End date cannot be before Start date
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Allocation */}
                            <div className="grid grid-cols-3 items-center gap-4 text-sm">
                                <label className="text-gray-400">Allocation</label>
                                <div className="col-span-2 flex items-center gap-2">
                                    <span className="text-blue-400 font-medium">{calculateDays().toFixed(2)}</span>
                                    <span className="text-blue-400">Days</span>
                                </div>
                            </div>

                            {/* Reason (Required by DB) */}
                            <div className="grid grid-cols-3 items-start gap-4 text-sm">
                                <label className="text-gray-400 pt-2">Reason</label>
                                <div className="col-span-2">
                                    <textarea
                                        className="w-full bg-gray-800 text-gray-200 rounded p-2 border border-gray-700 outline-none focus:border-blue-500"
                                        rows={2}
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Enter reason..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Attachment */}
                            <div className="grid grid-cols-3 items-center gap-4 text-sm">
                                <label className="text-gray-400">Attachment:</label>
                                <div className="col-span-2">
                                    <label className="flex items-center gap-2 cursor-pointer w-fit text-gray-400 hover:text-white transition-colors">
                                        <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white">
                                            <Upload className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs">(For sick leave certificate)</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                                        />
                                    </label>
                                    {attachment && <p className="text-xs text-green-400 mt-1 flex items-center gap-1"><Paperclip className="w-3 h-3" /> {attachment.name}</p>}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-2 rounded-md font-medium text-sm transition-colors"
                                >
                                    Discard
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
