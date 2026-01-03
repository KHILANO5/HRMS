import api, { type ApiResponse, handleApiError } from '../utils/api';

// Types
export interface Employee {
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
  departmentId: string;
  designationId: string;
  dateOfJoining: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  workLocation: string;
  reportingManagerId?: string;
  profilePicture?: string;
  isActive: boolean;
  department?: { id: string; name: string };
  designation?: { id: string; title: string };
  reportingManager?: { id: string; firstName: string; lastName: string };
  addresses?: any[];
  emergencyContacts?: any[];
}

export interface CreateEmployeeData {
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
  departmentId: string;
  designationId: string;
  dateOfJoining: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  workLocation: string;
  reportingManagerId?: string;
  currentAddress?: any;
  permanentAddress?: any;
  emergencyContacts?: any[];
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Designation {
  id: string;
  title: string;
  description?: string;
  level: string;
  isActive: boolean;
}

// Employee Service
class EmployeeService {
  /**
   * Get all employees
   */
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await api.get<ApiResponse<any>>('/employees');
      
      if (response.data.success && response.data.data) {
        // Backend returns { employees: [...], pagination: {...} }
        const data = response.data.data;
        return Array.isArray(data.employees) ? data.employees : [];
      }
      
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Employee not found');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    try {
      const response = await api.post<ApiResponse<Employee>>('/employees', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to create employee');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update employee
   */
  async updateEmployee(id: string, data: Partial<CreateEmployeeData>): Promise<Employee> {
    try {
      const response = await api.put<ApiResponse<Employee>>(`/employees/${id}`, data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update employee');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse>(`/employees/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete employee');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all departments
   */
  async getDepartments(): Promise<Department[]> {
    try {
      const response = await api.get<ApiResponse<Department[]>>('/employees/departments');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all designations
   */
  async getDesignations(): Promise<Designation[]> {
    try {
      const response = await api.get<ApiResponse<Designation[]>>('/employees/designations');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(employeeId: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post<ApiResponse<{ profilePicture: string }>>(
        `/employees/${employeeId}/profile-picture`,
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

export default new EmployeeService();
