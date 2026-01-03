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
    Users,
    TrendingUp,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// Mock attendance data - Using today's date
const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const MOCK_ATTENDANCE = [
    {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        department: 'IT',
        date: getTodayDateString(),
        checkIn: '09:00 AM',
        checkOut: '06:00 PM',
        status: 'Present',
        workHours: '9h 0m',
        overtime: '0h 0m'
    },
    {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        department: 'HR',
        date: getTodayDateString(),
        checkIn: '08:45 AM',
        checkOut: '05:30 PM',
        status: 'Present',
        workHours: '8h 45m',
        overtime: '0h 0m'
    },
    {
        id: '3',
        employeeId: 'EMP003',
        employeeName: 'Mike Johnson',
        department: 'Finance',
        date: getTodayDateString(),
        checkIn: '-',
        checkOut: '-',
        status: 'On Leave',
        workHours: '-',
        overtime: '-'
    },
    {
        id: '4',
        employeeId: 'EMP004',
        employeeName: 'Sarah Williams',
        department: 'IT',
        date: getTodayDateString(),
        checkIn: '09:15 AM',
        checkOut: '07:00 PM',
        status: 'Present',
        workHours: '9h 45m',
        overtime: '1h 45m'
    },
    {
        id: '5',
        employeeId: 'EMP005',
        employeeName: 'Robert Brown',
        department: 'Marketing',
        date: getTodayDateString(),
        checkIn: '-',
        checkOut: '-',
        status: 'Absent',
        workHours: '-',
        overtime: '-'
    },
    {
        id: '6',
        employeeId: 'EMP006',
        employeeName: 'Emily Davis',
        department: 'IT',
        date: getTodayDateString(),
        checkIn: '10:00 AM',
        checkOut: '06:30 PM',
        status: 'Late',
        workHours: '8h 30m',
        overtime: '0h 0m'
    },
    {
        id: '7',
        employeeId: 'EMP007',
        employeeName: 'David Wilson',
        department: 'Sales',
        date: getTodayDateString(),
        checkIn: '08:30 AM',
        checkOut: '05:00 PM',
        status: 'Present',
        workHours: '8h 30m',
        overtime: '0h 0m'
    },
    {
        id: '8',
        employeeId: 'EMP008',
        employeeName: 'Lisa Anderson',
        department: 'Operations',
        date: getTodayDateString(),
        checkIn: '09:00 AM',
        checkOut: '08:00 PM',
        status: 'Present',
        workHours: '11h 0m',
        overtime: '3h 0m'
    },
    {
        id: '9',
        employeeId: 'EMP009',
        employeeName: 'James Martinez',
        department: 'IT',
        date: getTodayDateString(),
        checkIn: '09:30 AM',
        checkOut: '06:00 PM',
        status: 'Late',
        workHours: '8h 30m',
        overtime: '0h 0m'
    },
    {
        id: '10',
        employeeId: 'EMP010',
        employeeName: 'Maria Garcia',
        department: 'HR',
        date: getTodayDateString(),
        checkIn: '08:50 AM',
        checkOut: '05:45 PM',
        status: 'Present',
        workHours: '8h 55m',
        overtime: '0h 0m'
    },
    {
        id: '11',
        employeeId: 'EMP011',
        employeeName: 'Thomas Lee',
        department: 'Finance',
        date: getTodayDateString(),
        checkIn: '09:00 AM',
        checkOut: '06:15 PM',
        status: 'Present',
        workHours: '9h 15m',
        overtime: '0h 15m'
    },
    {
        id: '12',
        employeeId: 'EMP012',
        employeeName: 'Jennifer Taylor',
        department: 'Marketing',
        date: getTodayDateString(),
        checkIn: '-',
        checkOut: '-',
        status: 'On Leave',
        workHours: '-',
        overtime: '-'
    }
];

const DEPARTMENTS = ['All', 'IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];
const STATUS_OPTIONS = ['All', 'Present', 'Absent', 'On Leave', 'Late', 'Half Day'];

export default function AttendancePage() {
    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [showFilters, setShowFilters] = useState(false);

    // Date navigation functions
    const handlePreviousDay = () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() - 1);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
    };

    const handleNextDay = () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + 1);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
    };

    const handleToday = () => {
        setSelectedDate(getTodayDate());
    };

    // Filter attendance records
    const filteredAttendance = MOCK_ATTENDANCE.filter(record => {
        const matchesSearch =
            record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.department.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDepartment = selectedDepartment === 'All' || record.department === selectedDepartment;
        const matchesStatus = selectedStatus === 'All' || record.status === selectedStatus;
        const matchesDate = record.date === selectedDate;

        return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
    });

    // Calculate statistics
    const totalEmployees = MOCK_ATTENDANCE.length;
    const presentCount = MOCK_ATTENDANCE.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const absentCount = MOCK_ATTENDANCE.filter(r => r.status === 'Absent').length;
    const onLeaveCount = MOCK_ATTENDANCE.filter(r => r.status === 'On Leave').length;
    const attendanceRate = ((presentCount / totalEmployees) * 100).toFixed(1);

    const getStatusBadge = (status: string) => {
        const badges = {
            'Present': 'badge badge-success',
            'Absent': 'badge badge-danger',
            'On Leave': 'badge badge-warning',
            'Late': 'badge badge-info',
            'Half Day': 'badge badge-secondary'
        };
        return badges[status as keyof typeof badges] || 'badge';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Present':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'Absent':
                return <XCircle className="w-4 h-4 text-red-600" />;
            case 'On Leave':
                return <Calendar className="w-4 h-4 text-yellow-600" />;
            case 'Late':
                return <Clock className="w-4 h-4 text-blue-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <AdminLayout
            title="Attendance Management"
            subtitle="Track and manage employee attendance"
        >
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="card p-6 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalEmployees}</h3>
                    <p className="text-sm text-gray-600">Total Employees</p>
                </div>

                <div className="card p-6 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-green-600">{attendanceRate}%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{presentCount}</h3>
                    <p className="text-sm text-gray-600">Present Today</p>
                </div>

                <div className="card p-6 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-sm font-semibold text-red-600">
                            {((absentCount / totalEmployees) * 100).toFixed(1)}%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{absentCount}</h3>
                    <p className="text-sm text-gray-600">Absent Today</p>
                </div>

                <div className="card p-6 card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="text-sm font-semibold text-yellow-600">
                            {((onLeaveCount / totalEmployees) * 100).toFixed(1)}%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{onLeaveCount}</h3>
                    <p className="text-sm text-gray-600">On Leave</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    {/* Date Selector */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePreviousDay}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="input-field"
                        />
                        <button
                            onClick={handleNextDay}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={handleToday}
                            className="btn-secondary text-sm"
                        >
                            Today
                        </button>
                    </div>

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
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
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

            {/* Attendance Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Check In
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Check Out
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Work Hours
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Extra Hours
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-gray-500 font-medium">No attendance records found</p>
                                            <p className="text-sm text-gray-400">Try adjusting your filters or search query</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAttendance.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                                    {record.employeeName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{record.employeeName}</p>
                                                    <p className="text-sm text-gray-500">{record.employeeId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-gray-700">{record.department}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-gray-700">{record.checkIn}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-gray-700">{record.checkOut}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-semibold text-gray-900">{record.workHours}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={record.overtime !== '-' && record.overtime !== '0h 0m' ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                                                {record.overtime}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(record.status)}
                                                <span className={getStatusBadge(record.status)}>
                                                    {record.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                to={`/admin/employees/${record.employeeId.toLowerCase()}`}
                                                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {filteredAttendance.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{filteredAttendance.length}</span> of{' '}
                            <span className="font-semibold">{MOCK_ATTENDANCE.length}</span> records
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
