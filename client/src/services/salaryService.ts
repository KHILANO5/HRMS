import api, { type ApiResponse, handleApiError } from '../utils/api';

// Types
export interface Salary {
  id: string;
  employeeId: string;
  basicSalary: number;
  effectiveFrom: string;
  currency: string;
  payFrequency: 'monthly' | 'bi-weekly' | 'weekly';
  components?: SalaryComponent[];
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
  };
}

export interface SalaryComponent {
  id: string;
  salaryId: string;
  componentName: string;
  componentType: 'earning' | 'deduction';
  amount: number;
  isPercentage: boolean;
  isTaxable: boolean;
}

export interface UpdateSalaryData {
  basicSalary?: number;
  effectiveFrom?: string;
  components?: Array<{
    componentName: string;
    componentType: 'earning' | 'deduction';
    amount: number;
    isPercentage: boolean;
    isTaxable: boolean;
  }>;
}

// Salary Service
class SalaryService {
  /**
   * Get employee salary details
   */
  async getEmployeeSalary(employeeId: string): Promise<Salary> {
    try {
      const response = await api.get<ApiResponse<Salary>>(`/salary/${employeeId}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Salary details not found');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update employee salary
   */
  async updateSalary(employeeId: string, data: UpdateSalaryData): Promise<Salary> {
    try {
      const response = await api.put<ApiResponse<Salary>>(`/salary/${employeeId}`, data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update salary');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Calculate total salary
   */
  calculateTotalSalary(salary: Salary): {
    basicSalary: number;
    totalEarnings: number;
    totalDeductions: number;
    netSalary: number;
  } {
    const basicSalary = salary.basicSalary;
    
    const earnings = salary.components?.filter((c) => c.componentType === 'earning') || [];
    const deductions = salary.components?.filter((c) => c.componentType === 'deduction') || [];
    
    const totalEarnings = earnings.reduce((sum, c) => {
      const amount = c.isPercentage ? (basicSalary * c.amount) / 100 : c.amount;
      return sum + amount;
    }, basicSalary);
    
    const totalDeductions = deductions.reduce((sum, c) => {
      const amount = c.isPercentage ? (basicSalary * c.amount) / 100 : c.amount;
      return sum + amount;
    }, 0);
    
    const netSalary = totalEarnings - totalDeductions;
    
    return {
      basicSalary,
      totalEarnings,
      totalDeductions,
      netSalary,
    };
  }
}

export default new SalaryService();
