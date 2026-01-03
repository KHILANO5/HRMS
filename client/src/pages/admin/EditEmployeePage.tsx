import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
    ArrowLeft,
    Save,
    X,
    Edit,
    Loader2,
    CheckCircle,
    AlertCircle
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

    // Address
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',

    // Emergency Contact
    emergencyContactName: 'Jane Doe',
    emergencyContactRelationship: 'Spouse',
    emergencyContactPhone: '+1 (555) 987-6543',

    // Salary
    monthlyWage: '50000',
    yearlyWage: '600000',
    workingDaysPerWeek: '5',
    breakTimeHours: '1',

    // Salary Components
    basicSalaryAmount: '25000',
    basicSalaryPercentage: '50.00',
    hraAmount: '12500',
    hraPercentage: '50.00',
    standardAllowanceAmount: '4167',
    standardAllowancePercentage: '16.67',
    performanceBonusAmount: '2082.50',
    performanceBonusPercentage: '8.33',
    leaveTravelAllowanceAmount: '2082.50',
    leaveTravelAllowancePercentage: '8.33',
    fixedAllowanceAmount: '2918',
    fixedAllowancePercentage: '11.67',

    // PF Contribution
    pfEmployeeAmount: '3000',
    pfEmployeePercentage: '12.00',
    pfEmployerAmount: '3000',
    pfEmployerPercentage: '12.00',

    // Tax Deductions
    professionalTaxAmount: '200',

    // Leave
    paidLeave: '15',
    sickLeave: '10',

    // Additional
    about: 'Experienced software engineer with 5+ years of expertise in full-stack development.',
    skills: 'React, Node.js, TypeScript, Python, AWS, Docker',
    certifications: 'AWS Certified Developer, Google Cloud Professional',
    interests: 'Photography, Hiking, Reading tech blogs'
};

export default function EditEmployeePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState(MOCK_EMPLOYEE);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`/api/v1/employees/${id}`, {
            //   method: 'PUT',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            //   },
            //   body: JSON.stringify(formData)
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSuccess(true);

            // Redirect after success
            setTimeout(() => {
                navigate(`/admin/employees/${id}`);
            }, 1500);

        } catch (err) {
            setError('Failed to update employee. Please try again.');
            console.error('Error updating employee:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/admin/employees/${id}`);
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <AdminLayout
            title="Edit Employee"
            subtitle={`${formData.firstName} ${formData.lastName} - ${formData.employeeCode}`}
        >
            {/* Back Button */}
            <div className="mb-6">
                <Link
                    to={`/admin/employees/${id}`}
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Profile</span>
                </Link>
            </div>

            {/* Success Message */}
            {success && (
                <div className="card p-6 mb-6 bg-green-50 border-green-200 animate-fade-in">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-semibold text-green-900">Employee updated successfully!</p>
                            <p className="text-sm text-green-700">Redirecting to profile...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="card p-4 mb-6 bg-red-50 border-red-200 animate-fade-in">
                    <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Header */}
                <div className="card p-8">
                    <div className="flex items-center space-x-6 mb-6">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {getInitials(formData.firstName, formData.lastName)}
                            </div>
                            <div className="absolute bottom-2 right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-purple-700 transition-colors">
                                <Edit className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Picture</h3>
                            <p className="text-sm text-gray-600">Click the edit icon to change profile picture</p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input-field"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input-field"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Department *
                            </label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="input-field"
                                required
                                disabled={isLoading}
                            >
                                <option value="">Select Department</option>
                                <option value="IT">IT</option>
                                <option value="HR">Human Resources</option>
                                <option value="Finance">Finance</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Designation *
                            </label>
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="input-field"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date of Joining *
                            </label>
                            <input
                                type="date"
                                name="dateOfJoining"
                                value={formData.dateOfJoining}
                                onChange={handleChange}
                                className="input-field"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Address Information</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Street Address
                            </label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                className="input-field"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="input-field"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="input-field"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                ZIP Code
                            </label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="input-field"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="input-field"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Emergency Contact</h3>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contact Name
                            </label>
                            <input
                                type="text"
                                name="emergencyContactName"
                                value={formData.emergencyContactName}
                                onChange={handleChange}
                                className="input-field"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Relationship
                            </label>
                            <input
                                type="text"
                                name="emergencyContactRelationship"
                                value={formData.emergencyContactRelationship}
                                onChange={handleChange}
                                className="input-field"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="emergencyContactPhone"
                                value={formData.emergencyContactPhone}
                                onChange={handleChange}
                                className="input-field"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Info */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Information</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                About
                            </label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="input-field min-h-[100px]"
                                placeholder="Brief description about the employee..."
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Skills (comma separated)
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="React, Node.js, Python..."
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Certifications (comma separated)
                            </label>
                            <input
                                type="text"
                                name="certifications"
                                value={formData.certifications}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="AWS Certified, Google Cloud..."
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Interests and Hobbies
                            </label>
                            <textarea
                                name="interests"
                                value={formData.interests}
                                onChange={handleChange}
                                className="input-field min-h-[80px]"
                                placeholder="Photography, Hiking..."
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Salary Information */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Salary Information</h3>

                    {/* Wage Information */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Wage Information</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Monthly Wage (₹)
                                </label>
                                <input
                                    type="number"
                                    name="monthlyWage"
                                    value={formData.monthlyWage}
                                    onChange={handleChange}
                                    className="input-field"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Yearly Wage (₹)
                                </label>
                                <input
                                    type="number"
                                    name="yearlyWage"
                                    value={formData.yearlyWage}
                                    onChange={handleChange}
                                    className="input-field"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Working Days/Week
                                </label>
                                <input
                                    type="number"
                                    name="workingDaysPerWeek"
                                    value={formData.workingDaysPerWeek}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="1"
                                    max="7"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Break Time (hours)
                                </label>
                                <input
                                    type="number"
                                    name="breakTimeHours"
                                    value={formData.breakTimeHours}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="0"
                                    max="8"
                                    step="0.5"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Salary Components */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Salary Components</h4>
                        <div className="space-y-4">
                            {/* Basic Salary */}
                            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Basic Salary Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="basicSalaryAmount"
                                        value={formData.basicSalaryAmount}
                                        onChange={handleChange}
                                        className="input-field"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Percentage (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="basicSalaryPercentage"
                                        value={formData.basicSalaryPercentage}
                                        onChange={handleChange}
                                        className="input-field"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* House Rent Allowance */}
                            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        House Rent Allowance (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="hraAmount"
                                        value={formData.hraAmount}
                                        onChange={handleChange}
                                        className="input-field"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Percentage (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="hraPercentage"
                                        value={formData.hraPercentage}
                                        onChange={handleChange}
                                        className="input-field"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Standard Allowance */}
                            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Standard Allowance (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="standardAllowanceAmount"
                                        value={formData.standardAllowanceAmount}
                                        onChange={handleChange}
                                        className="input-field"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Percentage (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="standardAllowancePercentage"
                                        value={formData.standardAllowancePercentage}
                                        onChange={handleChange}
                                        className="input-field"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Performance Bonus */}
                            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Performance Bonus (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="performanceBonusAmount"
                                        value={formData.performanceBonusAmount}
                                        onChange={handleChange}
                                        className="input-field"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Percentage (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="performanceBonusPercentage"
                                        value={formData.performanceBonusPercentage}
                                        onChange={handleChange}
                                        className="input-field"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Leave Travel Allowance */}
                            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Leave Travel Allowance (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="leaveTravelAllowanceAmount"
                                        value={formData.leaveTravelAllowanceAmount}
                                        onChange={handleChange}
                                        className="input-field"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Percentage (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="leaveTravelAllowancePercentage"
                                        value={formData.leaveTravelAllowancePercentage}
                                        onChange={handleChange}
                                        className="input-field"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Fixed Allowance */}
                            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Fixed Allowance (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="fixedAllowanceAmount"
                                        value={formData.fixedAllowanceAmount}
                                        onChange={handleChange}
                                        className="input-field"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Percentage (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="fixedAllowancePercentage"
                                        value={formData.fixedAllowancePercentage}
                                        onChange={handleChange}
                                        className="input-field"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PF Contribution */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Provident Fund (PF) Contribution</h4>
                        <div className="space-y-4">
                            {/* Employee PF */}
                            <div className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Employee PF Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="pfEmployeeAmount"
                                        value={formData.pfEmployeeAmount}
                                        onChange={handleChange}
                                        className="input-field"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Percentage (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="pfEmployeePercentage"
                                        value={formData.pfEmployeePercentage}
                                        onChange={handleChange}
                                        className="input-field"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Employer PF */}
                            <div className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Employer PF Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="pfEmployerAmount"
                                        value={formData.pfEmployerAmount}
                                        onChange={handleChange}
                                        className="input-field"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Percentage (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="pfEmployerPercentage"
                                        value={formData.pfEmployerPercentage}
                                        onChange={handleChange}
                                        className="input-field"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tax Deductions */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Tax Deductions</h4>
                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-red-50 rounded-lg">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Professional Tax (₹)
                                </label>
                                <input
                                    type="number"
                                    name="professionalTaxAmount"
                                    value={formData.professionalTaxAmount}
                                    onChange={handleChange}
                                    className="input-field"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leave Allocation */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Allocation</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Paid Leave (days/year)
                            </label>
                            <input
                                type="number"
                                name="paidLeave"
                                value={formData.paidLeave}
                                onChange={handleChange}
                                className="input-field"
                                min="0"
                                max="30"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Sick Leave (days/year)
                            </label>
                            <input
                                type="number"
                                name="sickLeave"
                                value={formData.sickLeave}
                                onChange={handleChange}
                                className="input-field"
                                min="0"
                                max="30"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pb-8">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-secondary flex items-center space-x-2"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                        <span>Cancel</span>
                    </button>

                    <button
                        type="submit"
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Saving Changes...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
