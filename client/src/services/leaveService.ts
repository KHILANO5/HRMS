import api, { type ApiResponse, handleApiError } from '../utils/api';

// Types
export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: 'paid' | 'sick' | 'casual' | 'maternity' | 'paternity';
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  year: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'paid' | 'sick' | 'casual' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  adminRemarks?: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
    department: { name: string };
  };
}

export interface CreateLeaveRequestData {
  leaveType: 'paid' | 'sick' | 'casual' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateLeaveRequestData {
  status: 'approved' | 'rejected';
  adminRemarks?: string;
}

// Leave Service
class LeaveService {
  /**
   * Get my leave balance
   */
  async getMyLeaveBalance(): Promise<LeaveBalance[]> {
    try {
      const response = await api.get<ApiResponse<LeaveBalance[]>>('/leaves/balance');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get employee leave balance
   */
  async getEmployeeLeaveBalance(employeeId: string): Promise<LeaveBalance[]> {
    try {
      const response = await api.get<ApiResponse<LeaveBalance[]>>(`/leaves/balance/${employeeId}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all leave requests
   */
  async getAllLeaveRequests(params?: {
    status?: 'pending' | 'approved' | 'rejected';
    employeeId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<LeaveRequest[]> {
    try {
      const response = await api.get<ApiResponse<LeaveRequest[]>>('/leaves/requests', {
        params,
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get my leave requests
   */
  async getMyLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const response = await api.get<ApiResponse<LeaveRequest[]>>('/leaves/my-requests');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create leave request
   */
  async createLeaveRequest(data: CreateLeaveRequestData): Promise<LeaveRequest> {
    try {
      const response = await api.post<ApiResponse<LeaveRequest>>('/leaves/requests', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to create leave request');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update leave request status (Admin only)
   */
  async updateLeaveRequestStatus(id: string, data: UpdateLeaveRequestData): Promise<LeaveRequest> {
    try {
      const response = await api.patch<ApiResponse<LeaveRequest>>(`/leaves/requests/${id}`, data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update leave request');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete leave request
   */
  async deleteLeaveRequest(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse>(`/leaves/requests/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete leave request');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Calculate number of days between dates
   */
  calculateLeaveDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }
}

export default new LeaveService();
