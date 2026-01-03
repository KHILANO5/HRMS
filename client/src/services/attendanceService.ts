import api, { type ApiResponse, handleApiError } from '../utils/api';

// Types
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workHours: number | null;
  extraHours: number | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave';
  remarks?: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
    department: { name: string };
  };
}

export interface CheckInData {
  checkInTime?: string;
  location?: {
    lat: number;
    lng: number;
  };
  remarks?: string;
}

export interface CheckOutData {
  checkOutTime?: string;
  remarks?: string;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  averageWorkHours: number;
}

// Attendance Service
class AttendanceService {
  /**
   * Check-in for the day
   */
  async checkIn(data: CheckInData = {}): Promise<AttendanceRecord> {
    try {
      const response = await api.post<ApiResponse<AttendanceRecord>>('/attendance/checkin', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Check-in failed');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Check-out for the day
   */
  async checkOut(data: CheckOutData = {}): Promise<AttendanceRecord> {
    try {
      const response = await api.post<ApiResponse<AttendanceRecord>>('/attendance/checkout', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Check-out failed');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all attendance records
   */
  async getAllAttendance(params?: {
    startDate?: string;
    endDate?: string;
    employeeId?: string;
    status?: string;
  }): Promise<AttendanceRecord[]> {
    try {
      const response = await api.get<ApiResponse<AttendanceRecord[]>>('/attendance', {
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
   * Get attendance by date
   */
  async getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
    try {
      const response = await api.get<ApiResponse<AttendanceRecord[]>>(`/attendance/date/${date}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get my attendance records
   */
  async getMyAttendance(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<AttendanceRecord[]> {
    try {
      const response = await api.get<ApiResponse<AttendanceRecord[]>>('/attendance/my-records', {
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
   * Get today's check-in status
   */
  async getTodayStatus(): Promise<AttendanceRecord | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const records = await this.getMyAttendance({
        startDate: today,
        endDate: today,
      });
      
      return records.length > 0 ? records[0] : null;
    } catch (error) {
      console.error('Error fetching today status:', error);
      return null;
    }
  }

  /**
   * Calculate attendance statistics
   */
  calculateStats(records: AttendanceRecord[]): AttendanceStats {
    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === 'present' || r.status === 'late').length;
    const absentDays = records.filter((r) => r.status === 'absent').length;
    const lateDays = records.filter((r) => r.status === 'late').length;
    const leaveDays = records.filter((r) => r.status === 'leave').length;
    
    const totalWorkHours = records.reduce((sum, r) => sum + (r.workHours || 0), 0);
    const averageWorkHours = totalDays > 0 ? totalWorkHours / totalDays : 0;
    
    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      leaveDays,
      averageWorkHours,
    };
  }
}

export default new AttendanceService();
