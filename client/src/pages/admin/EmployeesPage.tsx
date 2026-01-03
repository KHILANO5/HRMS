import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import employeeService from '../../services/employeeService';
import {
    Search,
    Filter,
    UserPlus,
    Users,
    Mail,
    Phone,
    Briefcase,
    Building,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle
} from 'lucide-react';

const DEPARTMENTS = ['All', 'IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Engineering'];
const WORK_STATUS = ['All', 'Present', 'Absent', 'On Leave'];

export default function EmployeesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await employeeService.getAllEmployees();
            console.log('📊 Fetched employees:', data);
            console.log('📊 Data type:', typeof data, 'Is array?', Array.isArray(data));
            // Ensure we have an array
            setEmployees(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch employees';
            setError(errorMessage);
            console.error('❌ Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter employees - add safety check
    const filteredEmployees = Array.isArray(employees) ? employees.filter(emp => {
        const matchesSearch =
            emp.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDepartment = selectedDepartment === 'All' || emp.department === selectedDepartment;
        const matchesStatus = selectedStatus === 'All' || emp.workStatus === selectedStatus.toLowerCase().replace(' ', '');

        return matchesSearch && matchesDepartment && matchesStatus;
    }) : [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'present':
                return <span className="badge badge-success flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Present</span>
                </span>;
            case 'absent':
                return <span className="badge badge-danger flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>Absent</span>
                </span>;
            case 'leave':
                return <span className="badge badge-warning flex items-center space-x-1">
                    <span>On Leave</span>
                </span>;
            default:
                return null;
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <AdminLayout
            title="Employee Management"
            subtitle={`${filteredEmployees.length} employees found`}
        >
            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="card p-6 bg-red-50 border-red-200">
                    <div className="flex items-center space-x-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <div>
                            <p className="font-semibold text-red-900">Failed to load employees</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                    <button onClick={fetchEmployees} className="btn-primary mt-4">
                        Retry
                    </button>
                </div>
            )}

            {/* Content */}
            {!loading && !error && (
                <>
            {/* Action Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10 w-full"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn-secondary flex items-center space-x-2"
                    >
                        <Filter className="w-5 h-5" />
                        <span>Filters</span>
                    </button>

                    <Link to="/admin/employees/add" className="btn-primary flex items-center space-x-2">
                        <UserPlus className="w-5 h-5" />
                        <span>Add Employee</span>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="card p-6 mb-6 animate-slide-up">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Work Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="input-field"
                            >
                                {WORK_STATUS.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">View Mode</label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'grid'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'list'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployees.map((employee) => (
                        <Link
                            key={employee.id}
                            to={`/admin/employees/${employee.id}`}
                            className="card p-6 card-hover group cursor-pointer block hover:border-purple-300 border border-transparent transition-all"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {getInitials(employee.firstName, employee.lastName)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{employee.firstName} {employee.lastName}</h3>
                                        <p className="text-sm text-gray-600">{employee.employeeCode}</p>
                                    </div>
                                </div>
                                {getStatusBadge(employee.workStatus)}
                            </div>

                            {/* Info */}
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span>{employee.designation}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span>{employee.department}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">{employee.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span>{employee.phone}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {getInitials(employee.firstName, employee.lastName)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{employee.firstName} {employee.lastName}</div>
                                                <div className="text-sm text-gray-600">{employee.employeeCode}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{employee.designation}</div>
                                        <div className="text-sm text-gray-600">{employee.department}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{employee.email}</div>
                                        <div className="text-sm text-gray-600">{employee.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(employee.workStatus)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                to={`/admin/employees/${employee.id}`}
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                to={`/admin/employees/${employee.id}/edit`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Empty State */}
            {filteredEmployees.length === 0 && (
                <div className="card p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedDepartment('All');
                            setSelectedStatus('All');
                        }}
                        className="btn-secondary"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
            </>
            )}
        </AdminLayout>
    );
}
