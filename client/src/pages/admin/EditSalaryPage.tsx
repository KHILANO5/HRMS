import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
    ArrowLeft,
    Save,
    X,
    Loader2,
    CheckCircle,
    AlertCircle,
    DollarSign
} from 'lucide-react';

// Mock salary data - Replace with API call
const MOCK_SALARY = {
    id: '1',
    employeeCode: 'EMP001',
    employeeName: 'John Doe',

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
    professionalTaxAmount: '200'
};

export default function EditSalaryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState(MOCK_SALARY);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSuccess(true);

            setTimeout(() => {
                navigate(`/admin/employees/${id}`);
            }, 1500);

        } catch (err) {
            setError('Failed to update salary information. Please try again.');
            console.error('Error updating salary:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/admin/employees/${id}`);
    };

    return (
        <AdminLayout
            title="Edit Salary Information"
            subtitle={`${formData.employeeName} - ${formData.employeeCode}`}
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
                            <p className="font-semibold text-green-900">Salary information updated successfully!</p>
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
                {/* Salary Information */}
                <div className="card p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <DollarSign className="w-6 h-6 text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-900">Salary Information</h3>
                    </div>

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
                                <span>Save Salary Information</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
