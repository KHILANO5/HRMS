import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import employeeService from '../../services/employeeService';
import {
    Save,
    X,
    User,
    Mail,
    Phone,
    Briefcase,
    Building,
    Calendar,
    MapPin,
    AlertCircle,
    Loader2,
    CheckCircle
} from 'lucide-react';

export default function AddEmployeePage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        // Basic Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        dateOfJoining: '',

        // Address
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',

        // Emergency Contact
        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactPhone: '',

        // Salary (Admin only)
        basicPay: '',
        hra: '',
        allowances: '',
        pfContribution: '',
        taxDeduction: '',

        // Leave Allocation
        paidLeave: '15',
        sickLeave: '10'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const validateForm = () => {
        // Basic validation
        if (!formData.firstName || !formData.lastName) {
            setError('First name and last name are required');
            return false;
        }

        if (!formData.email) {
            setError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!formData.department || !formData.designation) {
            setError('Department and designation are required');
            return false;
        }

        if (!formData.dateOfJoining) {
            setError('Date of joining is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Create employee via API
            await employeeService.createEmployee({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                department: formData.department,
                designation: formData.designation,
                dateOfJoining: formData.dateOfJoining,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country
                },
                emergencyContact: {
                    name: formData.emergencyContactName,
                    relationship: formData.emergencyContactRelationship,
                    phone: formData.emergencyContactPhone
                }
            });

            setSuccess(true);

            // Redirect after success
            setTimeout(() => {
                navigate('/admin/employees');
            }, 2000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create employee. Please try again.';
            setError(errorMessage);
            console.error('Error creating employee:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/employees');
    };

    return (
        <AdminLayout
            title="Add New Employee"
            subtitle="Create a new employee account and profile"
        >
            <div className="max-w-4xl">
                {/* Success Message */}
                {success && (
                    <div className="card p-6 mb-6 bg-green-50 border-green-200 animate-fade-in">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-900">Employee created successfully!</p>
                                <p className="text-sm text-green-700">Login credentials have been sent to the employee's email.</p>
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
                    {/* Basic Information */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <User className="w-5 h-5 text-purple-600" />
                            <span>Basic Information</span>
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="John"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Doe"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="john.doe@company.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="+1 (555) 123-4567"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Department *
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="input-field pl-10"
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
                            </div>

                            <div>
                                <label htmlFor="designation" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Designation *
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="designation"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="Software Engineer"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="dateOfJoining" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Date of Joining *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        id="dateOfJoining"
                                        name="dateOfJoining"
                                        value={formData.dateOfJoining}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-purple-600" />
                            <span>Address Information</span>
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="123 Main Street"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="New York"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="NY"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-2">
                                    ZIP Code
                                </label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="10001"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="USA"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <Phone className="w-5 h-5 text-purple-600" />
                            <span>Emergency Contact</span>
                        </h3>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="emergencyContactName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contact Name
                                </label>
                                <input
                                    type="text"
                                    id="emergencyContactName"
                                    name="emergencyContactName"
                                    value={formData.emergencyContactName}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Jane Doe"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="emergencyContactRelationship" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Relationship
                                </label>
                                <input
                                    type="text"
                                    id="emergencyContactRelationship"
                                    name="emergencyContactRelationship"
                                    value={formData.emergencyContactRelationship}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Spouse"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="emergencyContactPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="emergencyContactPhone"
                                    name="emergencyContactPhone"
                                    value={formData.emergencyContactPhone}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="+1 (555) 987-6543"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Leave Allocation */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <span>Leave Allocation</span>
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="paidLeave" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Paid Leave (days/year)
                                </label>
                                <input
                                    type="number"
                                    id="paidLeave"
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
                                <label htmlFor="sickLeave" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Sick Leave (days/year)
                                </label>
                                <input
                                    type="number"
                                    id="sickLeave"
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
                    <div className="flex items-center justify-end space-x-4">
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
                                    <span>Creating Employee...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Create Employee</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
