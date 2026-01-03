import api, { type ApiResponse, handleApiError } from '../utils/api';

// Types
export interface UserProfile {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'employee';
    isFirstLogin: boolean;
  };
  employee: {
    id: string;
    employeeCode: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    nationalId?: string;
    passportNumber?: string;
    dateOfJoining: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
    workLocation: string;
    profilePicture?: string;
    isActive: boolean;
    department?: { id: string; name: string };
    designation?: { id: string; title: string };
    reportingManager?: { id: string; firstName: string; lastName: string };
    addresses?: any[];
    emergencyContacts?: any[];
  };
}

export interface UpdateProfileData {
  phoneNumber?: string;
  dateOfBirth?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  nationalId?: string;
  passportNumber?: string;
  workLocation?: string;
  currentAddress?: any;
  permanentAddress?: any;
  emergencyContacts?: any[];
}

// Profile Service
class ProfileService {
  /**
   * Get my profile
   */
  async getMyProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<ApiResponse<UserProfile>>('/profile/me');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch profile');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update my profile
   */
  async updateMyProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      const response = await api.put<ApiResponse<UserProfile>>('/profile/me', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update profile');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post<ApiResponse<{ profilePicture: string }>>(
        '/profile/profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data.profilePicture;
      }
      
      throw new Error('Failed to upload profile picture');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new ProfileService();
