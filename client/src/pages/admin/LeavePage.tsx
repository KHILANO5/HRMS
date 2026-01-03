import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
    Calendar,
    Search,
    Filter,
    Download,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    AlertCircle,
    FileText,
    User
} from 'lucide-react';

// Mock leave requests data
const MOCK_LEAVE_REQUESTS = [
    {
        id: '1',
        employeeId: 'EMP003',
        employeeName: 'Mike Johnson',
        department: 'Finance',
        leaveType: 'Sick Leave',
        startDate: '2026-01-03',
        endDate: '2026-01-05',
        days: 3,
        reason: 'Fever and cold, doctor advised rest',
        status: 'Pending',
        appliedOn: '2026-01-02',
        approvedBy: null,
        approvedOn: null
    },
    {
        id: '2',
        employeeId: 'EMP012',
        employeeName: 'Jennifer Taylor',
        department: 'Marketing',
        leaveType: 'Paid Leave',
        startDate: '2026-01-03',
        endDate: '2026-01-10',
        days: 8,
        reason: 'Family vacation to Goa',
        status: 'Approved',
        appliedOn: '2025-12-20',
        approvedBy: 'Admin',
        approvedOn: '2025-12-21'
    },
    {
        id: '3',
        employeeId: 'EMP015',
        employeeName: 'Alex Kumar',
        department: 'IT',
        leaveType: 'Paid Leave',
        startDate: '2026-01-06',
        endDate: '2026-01-08',
        days: 3,
        reason: 'Attending cousin\'s wedding',
        status: 'Pending',
        appliedOn: '2026-01-01',
        approvedBy: null,
        approvedOn: null
    },
    {
        id: '4',
        employeeId: 'EMP007',
        employeeName: 'David Wilson',
        department: 'Sales',
        leaveType: 'Sick Leave',
        startDate: '2025-12-28',
        endDate: '2025-12-30',
        days: 3,
        reason: 'Viral infection',
        status: 'Approved',
        appliedOn: '2025-12-27',
        approvedBy: 'Admin',
        approvedOn: '2025-12-27'
    },
    {
        id: '5',
        employeeId: 'EMP018',
        employeeName: 'Priya Sharma',
        department: 'HR',
        leaveType: 'Paid Leave',
        startDate: '2026-01-15',
        endDate: '2026-01-17',
        days: 3,
        reason: 'Personal work',
        status: 'Pending',
        appliedOn: '2026-01-02',
        approvedBy: null,
        approvedOn: null
    },
    {
        id: '6',
        employeeId: 'EMP009',
        employeeName: 'James Martinez',
        department: 'IT',
        leaveType: 'Sick Leave',
        startDate: '2026-01-20',
        endDate: '2026-01-20',
        days: 1,
        reason: 'Medical checkup appointment',
        status: 'Rejected',
        appliedOn: '2026-01-02',
        approvedBy: 'Admin',
        approvedOn: '2026-01-02'
    },
    {
        id: '7',
        employeeId: 'EMP021',
        employeeName: 'Rachel Green',
        department: 'Operations',
        leaveType: 'Paid Leave',
        startDate: '2026-02-01',
        endDate: '2026-02-05',
        days: 5,
        reason: 'Trip to Kerala',
        status: 'Pending',
        appliedOn: '2026-01-03',
        approvedBy: null,
        approvedOn: null
    },
    {
        id: '8',
        employeeId: 'EMP005',
        employeeName: 'Robert Brown',
        department: 'Marketing',
        leaveType: 'Paid Leave',
        startDate: '2026-01-22',
        endDate: '2026-01-24',
        days: 3,
        reason: 'Attending conference in Mumbai',
        status: 'Approved',
        appliedOn: '2026-01-01',
        approvedBy: 'Admin',
        approvedOn: '2026-01-01'
    }
];

const DEPARTMENTS = ['All', 'IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];
const LEAVE_TYPES = ['All', 'Paid Leave', 'Sick Leave', 'Unpaid Leave'];
const STATUS_OPTIONS = ['All', 'Pending', 'Approved', 'Rejected'];

export default function LeavePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [selectedLeaveType, setSelectedLeaveType] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState(MOCK_LEAVE_REQUESTS);

    // Filter leave requests
    const filteredLeaves = leaveRequests.filter(leave => {
        const matchesSearch =
            leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            leave.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            leave.department.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDepartment = selectedDepartment === 'All' || leave.department === selectedDepartment;
        const matchesLeaveType = selectedLeaveType === 'All' || leave.leaveType === selectedLeaveType;
        const matchesStatus = selectedStatus === 'All' || leave.status === selectedStatus;

        return matchesSearch && matchesDepartment && matchesLeaveType && matchesStatus;
    });

    // Calculate statistics
    const totalRequests = leaveRequests.length;
    const pendingCount = leaveRequests.filter(l => l.status === 'Pending').length;
    const approvedCount = leaveRequests.filter(l => l.status === 'Approved').length;
    const rejectedCount = leaveRequests.filter(l => l.status === 'Rejected').length;

    const getStatusBadge = (status: string) => {
        const badges = {
            'Pending': 'badge badge-warning',
            'Approved': 'badge badge-success',
            'Rejected': 'badge badge-danger'
        };
        return badges[status as keyof typeof badges] || 'badge';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'Rejected':
                return <XCircle className="w-4 h-4 text-red-600" />;
            case 'Pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleApprove = (id: string) => {
        const today = new Date().toISOString().split('T')[0];
        setLeaveRequests(prevRequests =>
            prevRequests.map(request =>
                request.id === id
                    ? {
                        ...request,
                        status: 'Approved',
                        approvedBy: 'Admin',
                        approvedOn: today
                    }
                    : request
            )
        );
        // TODO: Implement API call to approve leave
        console.log('Approved leave request:', id);
    };

    const handleReject = (id: string) => {
        const today = new Date().toISOString().split('T')[0];
        setLeaveRequests(prevRequests =>
            prevRequests.map(request =>
                request.id === id
                    ? {
                        ...request,
                        status: 'Rejected',
                        approvedBy: 'Admin',
                        approvedOn: today
                    }
                    : request
            )
        );
        // TODO: Implement API call to reject leave
        console.log('Rejected leave request:', id);
    };

    return (
        <AdminLayout
            title="Leave Management"
            subtitle="Manage employee leave requests and approvals"
        >
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="card p-6 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalRequests}</h3>
                    <p className="text-sm text-gray-600">Total Requests</p>
                </div>

                <div className="card p-6 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="text-sm font-semibold text-yellow-600">
                            {((pendingCount / totalRequests) * 100).toFixed(0)}%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{pendingCount}</h3>
                    <p className="text-sm text-gray-600">Pending Approval</p>
                </div>

                <div className="card p-6 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                            {((approvedCount / totalRequests) * 100).toFixed(0)}%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{approvedCount}</h3>
                    <p className="text-sm text-gray-600">Approved</p>
                </div>

                <div className="card p-6 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-sm font-semibold text-red-600">
                            {((rejectedCount / totalRequests) * 100).toFixed(0)}%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{rejectedCount}</h3>
                    <p className="text-sm text-gray-600">Rejected</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Leave Requests</h3>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-purple-50 border-purple-300' : ''}`}
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                        <button className="btn-secondary flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by employee name, ID, or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Department
                            </label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="input-field"
                            >
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Leave Type
                            </label>
                            <select
                                value={selectedLeaveType}
                                onChange={(e) => setSelectedLeaveType(e.target.value)}
                                className="input-field"
                            >
                                {LEAVE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="input-field"
                            >
                                {STATUS_OPTIONS.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Leave Requests Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Dates
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Days
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Reason
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLeaves.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-gray-500 font-medium">No leave requests found</p>
                                            <p className="text-sm text-gray-400">Try adjusting your filters or search query</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                                                    {leave.employeeName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm truncate">{leave.employeeName}</p>
                                                    <p className="text-xs text-gray-500">{leave.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="text-sm text-gray-700">{leave.leaveType}</span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="text-xs">
                                                <p className="text-gray-700">{formatDate(leave.startDate)}</p>
                                                <p className="text-gray-500">to {formatDate(leave.endDate)}</p>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="font-semibold text-gray-900 text-sm">{leave.days}</span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <p className="text-sm text-gray-700 max-w-[200px] truncate" title={leave.reason}>
                                                {leave.reason}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center space-x-1">
                                                {getStatusIcon(leave.status)}
                                                <span className={getStatusBadge(leave.status)}>
                                                    {leave.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            {leave.status === 'Pending' ? (
                                                <div className="flex flex-col space-y-1">
                                                    <button
                                                        onClick={() => handleApprove(leave.id)}
                                                        className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md transition-colors text-xs font-medium"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        <span>Approve</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(leave.id)}
                                                        className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors text-xs font-medium"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        <span>Reject</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <Link
                                                    to={`/admin/employees/${leave.employeeId.toLowerCase()}`}
                                                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-xs"
                                                    title="View Profile"
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>View</span>
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {filteredLeaves.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{filteredLeaves.length}</span> of{' '}
                            <span className="font-semibold">{MOCK_LEAVE_REQUESTS.length}</span> requests
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
