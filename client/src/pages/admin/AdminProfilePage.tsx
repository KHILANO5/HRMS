import { useState } from 'react';

import AdminLayout from '../../components/AdminLayout';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Briefcase,
    Edit,
    Camera,
    Save,
    X
} from 'lucide-react';

export default function AdminProfilePage() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [activeTab, setActiveTab] = useState('resume');
    const [isEditing, setIsEditing] = useState(false);

    // Mock admin profile data
    const [profileData, setProfileData] = useState({
        name: user.name || 'Admin User',
        loginId: user.email || 'admin@dayflow.com',
        email: user.email || 'admin@dayflow.com',
        mobile: '+91 98765 43210',
        company: 'Dayflow HRMS',
        department: 'Administration',
        role: 'System Administrator',
        location: 'Mumbai, India',
        joinDate: '2024-01-01',
        about: 'Experienced system administrator with over 5 years of expertise in managing HR systems and ensuring smooth operations. Passionate about optimizing workflows and improving employee experience.',
        whatILove: 'I love working with teams to solve complex problems and implementing innovative solutions that make a real difference in daily operations.',
        interests: 'Technology, Team Management, Process Optimization, Data Analytics',
        skills: ['HR Management', 'System Administration', 'Data Analysis', 'Team Leadership', 'Process Improvement'],
        certifications: ['SHRM Certified Professional', 'PMP Certification', 'AWS Solutions Architect'],
        image: null as string | null
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData({ ...profileData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const addSkill = () => {
        const skill = window.prompt('Enter new skill:');
        if (skill) {
            setProfileData({ ...profileData, skills: [...profileData.skills, skill] });
        }
    };

    const removeSkill = (index: number) => {
        const newSkills = [...profileData.skills];
        newSkills.splice(index, 1);
        setProfileData({ ...profileData, skills: newSkills });
    };

    const addCertification = () => {
        const cert = window.prompt('Enter certification name:');
        if (cert) {
            setProfileData({ ...profileData, certifications: [...profileData.certifications, cert] });
        }
    };

    const removeCertification = (index: number) => {
        const newCerts = [...profileData.certifications];
        newCerts.splice(index, 1);
        setProfileData({ ...profileData, certifications: newCerts });
    };

    const handleSave = () => {
        // TODO: Implement API call to save profile
        user.name = profileData.name;
        user.email = profileData.email;
        localStorage.setItem('user', JSON.stringify(user));
        setIsEditing(false);
        console.log('Profile saved:', profileData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset to original data if needed
    };

    return (
        <AdminLayout
            title="My Profile"
            subtitle="Manage your account settings and information"
        >
            {/* Profile Header */}
            <div className="card p-6 mb-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-6">
                        {/* Profile Picture */}
                        <div className="relative group">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center overflow-hidden">
                                {profileData.image ? (
                                    <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-4xl font-bold">
                                        {profileData.name.split(' ').map((n: string) => n[0]).join('')}
                                    </span>
                                )}
                            </div>
                            <input
                                type="file"
                                id="profile-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {isEditing && (
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <Camera className="w-5 h-5 text-gray-600" />
                                </label>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 min-w-[300px]">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="text-3xl font-bold text-gray-900 border-b border-gray-300 focus:border-purple-600 focus:outline-none w-full pb-1"
                                        placeholder="Full Name"
                                    />
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={profileData.loginId}
                                                onChange={(e) => setProfileData({ ...profileData, loginId: e.target.value })}
                                                className="text-sm text-gray-600 border-b border-gray-300 focus:border-purple-600 focus:outline-none flex-1"
                                                placeholder="Login ID"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="text-sm text-gray-600 border-b border-gray-300 focus:border-purple-600 focus:outline-none flex-1"
                                                placeholder="Email Address"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={profileData.mobile}
                                                onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                                                className="text-sm text-gray-600 border-b border-gray-300 focus:border-purple-600 focus:outline-none flex-1"
                                                placeholder="Phone Number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <User className="w-4 h-4" />
                                            <span className="text-sm">Login ID: {profileData.loginId}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">{profileData.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            <span className="text-sm">{profileData.mobile}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <Edit className="w-5 h-5" />
                                <span className="hidden sm:inline">Edit Profile</span>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleCancel}
                                    className="btn-secondary flex items-center space-x-2"
                                >
                                    <X className="w-5 h-5" />
                                    <span className="hidden sm:inline">Cancel</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <Save className="w-5 h-5" />
                                    <span className="hidden sm:inline">Save Changes</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Company Info Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Company</p>
                        <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.company}
                                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                    className="font-semibold text-gray-900 border-b border-gray-300 focus:border-purple-600 focus:outline-none w-full"
                                />
                            ) : (
                                <p className="font-semibold text-gray-900">{profileData.company}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Department</p>
                        <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.department}
                                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                                    className="font-semibold text-gray-900 border-b border-gray-300 focus:border-purple-600 focus:outline-none w-full"
                                />
                            ) : (
                                <p className="font-semibold text-gray-900">{profileData.department}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Role</p>
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.role}
                                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                                    className="font-semibold text-gray-900 border-b border-gray-300 focus:border-purple-600 focus:outline-none w-full"
                                />
                            ) : (
                                <p className="font-semibold text-gray-900">{profileData.role}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.location}
                                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                    className="font-semibold text-gray-900 border-b border-gray-300 focus:border-purple-600 focus:outline-none w-full"
                                />
                            ) : (
                                <p className="font-semibold text-gray-900">{profileData.location}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card mb-6">
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('resume')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'resume'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Resume
                        </button>
                        <button
                            onClick={() => setActiveTab('private')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'private'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Private Info
                        </button>
                        <button
                            onClick={() => setActiveTab('salary')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'salary'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Salary Info
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'resume' && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* About */}
                        <div className="card p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
                            {isEditing ? (
                                <textarea
                                    value={profileData.about}
                                    onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                                    className="input-field min-h-[100px]"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed">{profileData.about}</p>
                            )}
                        </div>

                        {/* What I Love About My Job */}
                        <div className="card p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">What I Love About My Job</h3>
                            {isEditing ? (
                                <textarea
                                    value={profileData.whatILove}
                                    onChange={(e) => setProfileData({ ...profileData, whatILove: e.target.value })}
                                    className="input-field min-h-[100px]"
                                    placeholder="What do you love about your job..."
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed">{profileData.whatILove}</p>
                            )}
                        </div>

                        {/* Interests and Hobbies */}
                        <div className="card p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">My Interests and Hobbies</h3>
                            {isEditing ? (
                                <textarea
                                    value={profileData.interests}
                                    onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                                    className="input-field min-h-[80px]"
                                    placeholder="Your interests and hobbies..."
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed">{profileData.interests}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Skills */}
                        <div className="card p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
                            <div className="space-y-2">
                                {profileData.skills.map((skill, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{skill}</span>
                                        {isEditing && (
                                            <button
                                                onClick={() => removeSkill(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {isEditing && (
                                    <button
                                        onClick={addSkill}
                                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors"
                                    >
                                        + Add Skill
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="card p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Certifications</h3>
                            <div className="space-y-2">
                                {profileData.certifications.map((cert, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{cert}</span>
                                        {isEditing && (
                                            <button
                                                onClick={() => removeCertification(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {isEditing && (
                                    <button
                                        onClick={addCertification}
                                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors"
                                    >
                                        + Add Certification
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'private' && (
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Private Information</h3>
                    <p className="text-gray-600">Private information section - Coming soon</p>
                </div>
            )}

            {activeTab === 'salary' && (
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Salary Information</h3>
                    <p className="text-gray-600">Salary information section - Coming soon</p>
                </div>
            )}
        </AdminLayout>
    );
}
