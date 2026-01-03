import api, { type ApiResponse, handleApiError } from '../utils/api';

// Types
export interface AdminDashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  pendingLeaveRequests: number;
  newEmployeesThisMonth: number;
  recentLeaveRequests: Array<{
    id: string;
    employeeName: string;
    employeeCode: string;
    department: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    numberOfDays: number;
    reason: string;
    status: string;
    appliedOn: string;
  }>;
  recentEmployees: Array<{
    id: string;
    employeeCode: string;
    name: string;
    department: string;
    designation: string;
    dateOfJoining: string;
  }>;
}

export interface EmployeeDashboardStats {
  checkInStatus: {
    checkedIn: boolean;
    checkInTime: string | null;
    checkOutTime: string | null;
    status: 'on-time' | 'late' | 'not-checked-in';
    date: string;
  };
  monthlyAttendance: {
    presentDays: number;
    absentDays: number;
    leaveDays: number;
    percentage: number;
  };
  leaveBalance: {
    paid: {
      total: number;
      used: number;
      remaining: number;
    };
    sick: {
      total: number;
      used: number;
      remaining: number;
    };
  };
  pendingActions: {
    profileCompletion: number;
    pendingLeaveRequests: number;
    documentsNeeded: number;
  };
  recentAttendance: Array<{
    date: string;
    checkIn: string;
    checkOut: string;
    workHours: string;
    status: string;
  }>;
  recentLeaveRequests: Array<{
    id: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    numberOfDays: number;
    status: string;
    appliedOn: string;
  }>;
}

// Dashboard Service
class DashboardService {
  /**
   * Get admin dashboard statistics
   */
  async getAdminStats(): Promise<AdminDashboardStats> {
    try {
      const response = await api.get<ApiResponse<AdminDashboardStats>>('/dashboard/admin/stats');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch admin dashboard stats');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get employee dashboard statistics
   */
  async getEmployeeStats(): Promise<EmployeeDashboardStats> {
    try {
      const response = await api.get<ApiResponse<EmployeeDashboardStats>>('/dashboard/employee/stats');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch employee dashboard stats');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new DashboardService();
