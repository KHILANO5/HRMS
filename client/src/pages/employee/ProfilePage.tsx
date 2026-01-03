import { useState } from 'react';
import {
    LayoutDashboard,
    Calendar,
    User,
    FileText,
    LogOut,
    Building2,
    Menu,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    PenSquare,
    Save,
    X
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

export default function ProfilePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('private'); // 'resume', 'private', 'salary', 'security'
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Mock User Data based on Schema & Image
    const [isEditing, setIsEditing] = useState(false);

    // Mock User Data based on Schema & Image
    const [employeeData, setEmployeeData] = useState({
        firstName: 'Khilan',
        lastName: 'Patel',
        designation: 'Senior Developer',
        email: user.email || 'khilan.patel@dayflow.com',
        phone: '+91 98765 43210',
        company: 'Dayflow Inc.',
        department: 'Engineering',
        manager: 'Sarah Wilson',
        location: 'Ahmedabad, India',
        profilePic: null, // text fallback

        // Private Info
        dob: '15/08/1995',
        address: 'B-404, Silicon Valley, Satellite',
        city: 'Ahmedabad',
        country: 'India',
        nationality: 'Indian',
        personalEmail: 'khilan.personal@gmail.com',
        gender: 'Male',
        maritalStatus: 'Single',
        joiningDate: '10/01/2023',

        // Bank Info (Salary Info Tab)
        bankName: 'HDFC Bank',
        accountNumber: '12345678901234',
        ifscCode: 'HDFC0001234',
        panNo: 'ABCDE1234F',
        uanNo: '100900123456',
        empCode: 'EMP-2023-001'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically send the data to the backend
        alert('Profile updated successfully!');
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
                    <Link to="/employee/dashboard" className="h-16 flex items-center px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Dayflow
                        </span>
                    </Link>

                    <nav className="flex-1 py-6 px-3 space-y-1">
                        <NavItem to="/employee/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem to="/employee/check-ins" icon={User} label="Employees" />
                        <NavItem to="/employee/attendance" icon={Calendar} label="My Attendance" />
                        <NavItem to="/employee/leave" icon={FileText} label="Leave Request" />
                    </nav>
                    {/* User Profile in Sidebar - REMOVED */}
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
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        <div className="flex items-center space-x-4">
                            <Link to="/employee/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'Employee'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email || 'employee@dayflow.com'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                                    {user.name ? user.name.charAt(0) : 'E'}
                                </div>
                            </Link>
                            <div className="h-8 w-px bg-gray-200 mx-2"></div>
                            <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">

                        </div>
                        <div className="px-6 pb-6">
                            <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-400 shadow-md overflow-hidden">
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            employeeData.firstName.charAt(0)
                                        )}
                                    </div>
                                    <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors border-2 border-white cursor-pointer">
                                        <PenSquare className="w-4 h-4" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>
                                <div className="flex-1 pt-2 md:pt-0">
                                    <h2 className="text-2xl font-bold text-gray-900">{employeeData.firstName} {employeeData.lastName}</h2>
                                    <p className="text-gray-500 font-medium">{employeeData.designation}</p>
                                </div>
                            </div>

                            {/* Detailed Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm truncate">{employeeData.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Mobile</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{employeeData.phone}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Company</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{employeeData.company}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{employeeData.location}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Department</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Briefcase className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{employeeData.department}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Manager</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{employeeData.manager}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6 flex space-x-6 overflow-x-auto">
                        {['Resume', 'Private Info', 'Salary Info', 'Security'].map((tab) => {
                            const tabKey = tab.toLowerCase().replace(' ', '');
                            const isActive = activeTab === tabKey;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tabKey)}
                                    className={`
                                        pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                                        ${isActive
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                    `}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="card p-6">
                        {activeTab === 'privateinfo' && (
                            <div className="animate-fade-in-up">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Personal Details Column */}
                                    <div>
                                        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                            <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
                                            {!isEditing ? (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                                                >
                                                    <PenSquare className="w-4 h-4" />
                                                    Edit
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={handleSave}
                                                        className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4 items-center">
                                                <span className="text-sm text-gray-500 sm:col-span-1">Date of Birth</span>
                                                <div className="sm:col-span-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="dob"
                                                            value={employeeData.dob}
                                                            onChange={handleInputChange}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-900">{employeeData.dob}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4 items-center">
                                                <span className="text-sm text-gray-500 sm:col-span-1">Residing Address</span>
                                                <div className="sm:col-span-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            value={employeeData.address}
                                                            onChange={handleInputChange}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-900">{employeeData.address}, {employeeData.city}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4 items-center">
                                                <span className="text-sm text-gray-500 sm:col-span-1">Nationality</span>
                                                <div className="sm:col-span-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="nationality"
                                                            value={employeeData.nationality}
                                                            onChange={handleInputChange}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-900">{employeeData.nationality}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4 items-center">
                                                <span className="text-sm text-gray-500 sm:col-span-1">Personal Email</span>
                                                <div className="sm:col-span-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="personalEmail"
                                                            value={employeeData.personalEmail}
                                                            onChange={handleInputChange}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-900">{employeeData.personalEmail}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4 items-center">
                                                <span className="text-sm text-gray-500 sm:col-span-1">Gender</span>
                                                <div className="sm:col-span-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="gender"
                                                            value={employeeData.gender}
                                                            onChange={handleInputChange}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-900">{employeeData.gender}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4 items-center">
                                                <span className="text-sm text-gray-500 sm:col-span-1">Marital Status</span>
                                                <div className="sm:col-span-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="maritalStatus"
                                                            value={employeeData.maritalStatus}
                                                            onChange={handleInputChange}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-900">{employeeData.maritalStatus}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4 items-center">
                                                <span className="text-sm text-gray-500 sm:col-span-1">Date of Joining</span>
                                                <span className="text-sm font-medium text-gray-900 sm:col-span-2">{employeeData.joiningDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Details Column */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Bank Details</h3>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                                <span className="text-sm text-gray-500 sm:col-span-1">Account Number</span>
                                                <span className="text-sm font-medium text-gray-900 sm:col-span-2 font-mono">{employeeData.accountNumber}</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                                <span className="text-sm text-gray-500 sm:col-span-1">Bank Name</span>
                                                <span className="text-sm font-medium text-gray-900 sm:col-span-2">{employeeData.bankName}</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                                <span className="text-sm text-gray-500 sm:col-span-1">IFSC Code</span>
                                                <span className="text-sm font-medium text-gray-900 sm:col-span-2 font-mono">{employeeData.ifscCode}</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                                <span className="text-sm text-gray-500 sm:col-span-1">PAN No</span>
                                                <span className="text-sm font-medium text-gray-900 sm:col-span-2 font-mono">{employeeData.panNo}</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                                <span className="text-sm text-gray-500 sm:col-span-1">UAN NO</span>
                                                <span className="text-sm font-medium text-gray-900 sm:col-span-2 font-mono">{employeeData.uanNo}</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                                <span className="text-sm text-gray-500 sm:col-span-1">Emp Code</span>
                                                <span className="text-sm font-medium text-gray-900 sm:col-span-2">{employeeData.empCode}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'salaryinfo' && (
                            <div className="animate-fade-in-up">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Bank Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500 sm:col-span-1">Account Number</span>
                                        <span className="text-sm font-medium text-gray-900 sm:col-span-2 font-mono">{employeeData.accountNumber}</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500 sm:col-span-1">Bank Name</span>
                                        <span className="text-sm font-medium text-gray-900 sm:col-span-2">{employeeData.bankName}</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500 sm:col-span-1">IFSC Code</span>
                                        <span className="text-sm font-medium text-gray-900 sm:col-span-2 font-mono">{employeeData.ifscCode}</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500 sm:col-span-1">PAN No</span>
                                        <span className="text-sm font-medium text-gray-900 sm:col-span-2 font-mono">{employeeData.panNo}</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500 sm:col-span-1">UAN No</span>
                                        <span className="text-sm font-medium text-gray-900 sm:col-span-2 font-mono">{employeeData.uanNo}</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500 sm:col-span-1">Employee Code</span>
                                        <span className="text-sm font-medium text-gray-900 sm:col-span-2">{employeeData.empCode}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'resume' && (
                            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
                                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No Resume Uploaded</h3>
                                <p className="text-gray-500 max-w-sm mt-2 mb-6">Upload your resume to keep your profile updated.</p>
                                <button className="btn-primary">Upload Resume</button>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="animate-fade-in-up">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h3>
                                <div className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <button className="btn-primary w-full">Change Password</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
