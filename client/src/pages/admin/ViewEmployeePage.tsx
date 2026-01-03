
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ArrowLeft,
    Edit,
    Award
} from 'lucide-react';

// Mock employee data - Replace with API call
const MOCK_EMPLOYEE = {
    id: '1',
    employeeCode: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'IT',
    designation: 'Software Engineer',
    dateOfJoining: '2024-01-15',
    profilePicture: null,
    isActive: true,

    // Address
    address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
    },

    // Emergency Contact
    emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543'
    },

    // Salary Info
    salary: {
        monthlyWage: 50000,
        yearlyWage: 600000,
        workingDaysPerWeek: 5,
        breakTimeHours: 1,

        // Salary Components
        components: {
            basicSalary: { amount: 25000, percentage: 50.00 },
            houseRentAllowance: { amount: 12500, percentage: 50.00 },
            standardAllowance: { amount: 4167, percentage: 16.67 },
            performanceBonus: { amount: 2082.50, percentage: 8.33 },
            leaveTravelAllowance: { amount: 2082.50, percentage: 8.33 },
            fixedAllowance: { amount: 2918, percentage: 11.67 }
        },

        // PF Contribution
        pfContribution: {
            employee: { amount: 3000, percentage: 12.00 },
            employer: { amount: 3000, percentage: 12.00 }
        },

        // Tax Deductions
        taxDeductions: {
            professionalTax: { amount: 200 }
        },

        // Calculated totals
        grossSalary: 48750,
        totalDeductions: 3200,
        netSalary: 45550
    },

    // Leave Balance
    leaveBalance: {
        paidLeave: { total: 15, used: 3, remaining: 12 },
        sickLeave: { total: 10, used: 2, remaining: 8 }
    },

    // About
    about: 'Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about creating scalable and efficient solutions.',

    // Skills
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'],

    // Certifications
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],

    // Interests
    interests: 'Photography, Hiking, Reading tech blogs, Contributing to open-source projects'
};

type TabType = 'resume' | 'private' | 'salary';

export default function ViewEmployeePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('resume');

    const employee = MOCK_EMPLOYEE; // Replace with: const { data: employee } = useQuery(['employee', id], fetchEmployee);

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)} `.toUpperCase();
    };

    return (
        <AdminLayout
            title="Employee Profile"
            subtitle={`${employee.firstName} ${employee.lastName} - ${employee.employeeCode} `}
        >
            {/* Back Button */}
            <div className="mb-6">
                <Link
                    to="/admin/employees"
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Employees</span>
                </Link>
            </div>

            {/* Profile Header Card */}
            <div className="card p-8 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Left: Profile Info */}
                    <div className="flex items-center space-x-6">
                        {/* Profile Picture */}
                        <div className="relative group">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {getInitials(employee.firstName, employee.lastName)}
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {employee.firstName} {employee.lastName}
                            </h2>
                            <p className="text-lg text-gray-600 mb-1">Login ID: {employee.email}</p>
                            <p className="text-gray-600 mb-3">Employee Code: {employee.employeeCode}</p>

                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">{employee.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">{employee.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Company Info */}
                    <div className="bg-gray-50 rounded-lg p-6 min-w-[280px]">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Company</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Department</p>
                                <p className="font-semibold text-gray-900">{employee.department}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Manager</p>
                                <p className="font-semibold text-gray-900">Sarah Williams</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Location</p>
                                <p className="font-semibold text-gray-900">{employee.address.city}, {employee.address.state}</p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            {/* Tabs */}
            <div className="card mt-6 overflow-hidden">
                <div className="border-b border-gray-200 bg-white px-6 pt-4">
                    <div className="flex space-x-6">
                        <button
                            onClick={() => setActiveTab('resume')}
                            className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 relative ${activeTab === 'resume'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Resume
                        </button>
                        <button
                            onClick={() => setActiveTab('private')}
                            className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 relative ${activeTab === 'private'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Private Info
                        </button>
                        <button
                            onClick={() => setActiveTab('salary')}
                            className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 relative ${activeTab === 'salary'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Salary Info
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Resume Tab */}
                    {activeTab === 'resume' && (
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* About */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                                    <p className="text-gray-700 leading-relaxed">{employee.about}</p>
                                </div>

                                {/* What I love about my job */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">What I love about my job</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Working with cutting-edge technologies and collaborating with talented team members.
                                        The opportunity to solve complex problems and see the direct impact of my work.
                                    </p>
                                </div>

                                {/* Interests and Hobbies */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">My interests and hobbies</h3>
                                    <p className="text-gray-700 leading-relaxed">{employee.interests}</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Skills */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {employee.skills.map((skill, index) => (
                                            <span key={index} className="badge badge-primary">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                </div>

                                {/* Certifications */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Certification</h3>
                                    <div className="space-y-2">
                                        {employee.certifications.map((cert, index) => (
                                            <div key={index} className="flex items-center space-x-2 text-gray-700">
                                                <Award className="w-4 h-4 text-purple-600" />
                                                <span>{cert}</span>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Private Info Tab */}
                    {activeTab === 'private' && (
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Personal Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <User className="w-5 h-5 text-purple-600" />
                                    <span>Personal Details</span>
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Full Name</p>
                                        <p className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <p className="font-medium text-gray-900">{employee.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                                        <p className="font-medium text-gray-900">{employee.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Date of Joining</p>
                                        <p className="font-medium text-gray-900">{new Date(employee.dateOfJoining).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <MapPin className="w-5 h-5 text-purple-600" />
                                    <span>Address</span>
                                </h3>
                                <div className="space-y-2 text-gray-700">
                                    <p>{employee.address.street}</p>
                                    <p>{employee.address.city}, {employee.address.state} {employee.address.zipCode}</p>
                                    <p>{employee.address.country}</p>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Phone className="w-5 h-5 text-purple-600" />
                                    <span>Emergency Contact</span>
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Name</p>
                                        <p className="font-medium text-gray-900">{employee.emergencyContact.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Relationship</p>
                                        <p className="font-medium text-gray-900">{employee.emergencyContact.relationship}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                                        <p className="font-medium text-gray-900">{employee.emergencyContact.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Leave Balance */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    <span>Leave Balance</span>
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-sm text-blue-600 font-semibold mb-2">Paid Leave</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-blue-900">{employee.leaveBalance.paidLeave.remaining}</span>
                                            <span className="text-sm text-blue-600">of {employee.leaveBalance.paidLeave.total} days</span>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-1">Used: {employee.leaveBalance.paidLeave.used} days</p>
                                    </div>

                                    <div className="bg-green-50 rounded-lg p-4">
                                        <p className="text-sm text-green-600 font-semibold mb-2">Sick Leave</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-green-900">{employee.leaveBalance.sickLeave.remaining}</span>
                                            <span className="text-sm text-green-600">of {employee.leaveBalance.sickLeave.total} days</span>
                                        </div>
                                        <p className="text-xs text-green-600 mt-1">Used: {employee.leaveBalance.sickLeave.used} days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Salary Info Tab */}
                    {activeTab === 'salary' && (
                        <div className="max-w-6xl">
                            {/* Wage Information */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Month Wage</p>
                                            <p className="text-3xl font-bold text-gray-900">₹{employee.salary.monthlyWage.toLocaleString()}</p>
                                            <p className="text-sm text-gray-600 mt-1">/ Month</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">No of working days</p>
                                            <p className="text-sm text-gray-600">in a week:</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{employee.salary.workingDaysPerWeek}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Yearly Wage</p>
                                            <p className="text-3xl font-bold text-gray-900">₹{employee.salary.yearlyWage.toLocaleString()}</p>
                                            <p className="text-sm text-gray-600 mt-1">/ Yearly</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Break Time:</p>
                                            <p className="text-4xl font-bold text-gray-900 mt-2">{employee.salary.breakTimeHours}</p>
                                            <p className="text-sm text-gray-600">/hrs</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Salary Components */}
                            <div className="card p-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Salary Components</h3>
                                <div className="space-y-4">
                                    {/* Basic Salary */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-gray-900">Basic Salary</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-900 font-semibold">₹{employee.salary.components.basicSalary.amount.toLocaleString()}</span>
                                                <span className="text-sm text-gray-600">₹ / month</span>
                                                <span className="text-sm font-semibold text-purple-600 min-w-[60px] text-right">{employee.salary.components.basicSalary.percentage} %</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">Define Basic salary from company cost compute it based on monthly Wages</p>
                                    </div>

                                    {/* House Rent Allowance */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-gray-900">House Rent Allowance</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-900 font-semibold">₹{employee.salary.components.houseRentAllowance.amount.toLocaleString()}</span>
                                                <span className="text-sm text-gray-600">₹ / month</span>
                                                <span className="text-sm font-semibold text-purple-600 min-w-[60px] text-right">{employee.salary.components.houseRentAllowance.percentage} %</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">HRA provided to employees 50% of the basic salary</p>
                                    </div>

                                    {/* Standard Allowance */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-gray-900">Standard Allowance</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-900 font-semibold">₹{employee.salary.components.standardAllowance.amount.toLocaleString()}</span>
                                                <span className="text-sm text-gray-600">₹ / month</span>
                                                <span className="text-sm font-semibold text-purple-600 min-w-[60px] text-right">{employee.salary.components.standardAllowance.percentage} %</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">A standard allowance is a predetermined, fixed amount provided to employee as part of their salary</p>
                                    </div>

                                    {/* Performance Bonus */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-gray-900">Performance Bonus</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-900 font-semibold">₹{employee.salary.components.performanceBonus.amount.toLocaleString()}</span>
                                                <span className="text-sm text-gray-600">₹ / month</span>
                                                <span className="text-sm font-semibold text-purple-600 min-w-[60px] text-right">{employee.salary.components.performanceBonus.percentage} %</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary</p>
                                    </div>

                                    {/* Leave Travel Allowance */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-gray-900">Leave Travel Allowance</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-900 font-semibold">₹{employee.salary.components.leaveTravelAllowance.amount.toLocaleString()}</span>
                                                <span className="text-sm text-gray-600">₹ / month</span>
                                                <span className="text-sm font-semibold text-purple-600 min-w-[60px] text-right">{employee.salary.components.leaveTravelAllowance.percentage} %</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">LTA is paid by the company to employees to cover their travel expenses, and calculated as a % of the basic salary</p>
                                    </div>

                                    {/* Fixed Allowance */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-gray-900">Fixed Allowance</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-900 font-semibold">₹{employee.salary.components.fixedAllowance.amount.toLocaleString()}</span>
                                                <span className="text-sm text-gray-600">₹ / month</span>
                                                <span className="text-sm font-semibold text-purple-600 min-w-[60px] text-right">{employee.salary.components.fixedAllowance.percentage} %</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">Fixed allowance portion of wage is determined after calculating all salary components</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* PF Contribution */}
                                <div className="card p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Provident Fund (PF) Contribution</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-gray-900">Employee</span>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-gray-900 font-semibold">₹{employee.salary.pfContribution.employee.amount.toLocaleString()}</span>
                                                    <span className="text-sm text-gray-600">₹ / month</span>
                                                    <span className="text-sm font-semibold text-blue-600 min-w-[60px] text-right">{employee.salary.pfContribution.employee.percentage} %</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">PF is calculated based on the basic salary</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-gray-900">Employer</span>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-gray-900 font-semibold">₹{employee.salary.pfContribution.employer.amount.toLocaleString()}</span>
                                                    <span className="text-sm text-gray-600">₹ / month</span>
                                                    <span className="text-sm font-semibold text-blue-600 min-w-[60px] text-right">{employee.salary.pfContribution.employer.percentage} %</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">PF is calculated based on the basic salary</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tax Deductions */}
                                <div className="card p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Tax Deductions</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-gray-900">Professional Tax</span>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-gray-900 font-semibold">₹{employee.salary.taxDeductions.professionalTax.amount.toLocaleString()}</span>
                                                    <span className="text-sm text-gray-600">₹ / month</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">Professional Tax deducted from the Gross salary</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="card p-6 mt-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-lg">
                                        <span className="font-semibold text-gray-900">Gross Salary</span>
                                        <span className="font-bold text-gray-900">₹{employee.salary.grossSalary.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-lg">
                                        <span className="font-semibold text-gray-900">Total Deductions</span>
                                        <span className="font-bold text-red-600">- ₹{employee.salary.totalDeductions.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t-2 border-purple-300 pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-purple-900">Net Salary (Monthly)</span>
                                            <span className="text-4xl font-bold text-purple-900">₹{employee.salary.netSalary.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Salary Button */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => navigate(`/ admin / employees / ${id}/edit-salary`)}
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <Edit className="w-5 h-5" />
                                    <span>Edit Salary Information</span>
                                </button >
                            </div >
                        </div >
                    )}
                </div >
            </div >
        </AdminLayout >
    );
}
