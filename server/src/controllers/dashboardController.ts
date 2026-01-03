import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';
import { Op } from 'sequelize';

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const { Employee, Attendance, LeaveRequest } = req.app.locals.models;
    
    // Get current date
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    // Total active employees
    const totalEmployees = await Employee.count({ where: { isActive: true } });
    
    // Today's attendance counts
    const todayAttendance = await Attendance.findAll({
      where: { attendanceDate: today }
    });
    
    const presentToday = todayAttendance.filter(a => a.status === 'present').length;
    const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
    const onLeaveToday = todayAttendance.filter(a => a.status === 'leave').length;
    
    // Pending leave requests
    const pendingLeaveRequests = await LeaveRequest.count({
      where: { status: 'pending' }
    });
    
    // New employees this month
    const newEmployeesThisMonth = await Employee.count({
      where: {
        isActive: true,
        dateOfJoining: {
          [Op.gte]: `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`
        }
      }
    });
    
    // Recent leave requests (last 5 pending)
    const recentLeaveRequests = await LeaveRequest.findAll({
      where: { status: 'pending' },
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'employeeCode', 'firstName', 'lastName', 'department']
        }
      ]
    });
    
    // Recent employees (last 5)
    const recentEmployees = await Employee.findAll({
      where: { isActive: true },
      limit: 5,
      order: [['dateOfJoining', 'DESC']],
      attributes: ['id', 'employeeCode', 'firstName', 'lastName', 'department', 'designation', 'dateOfJoining']
    });
    
    res.json(
      successResponse('Admin dashboard stats retrieved successfully', {
        totalEmployees,
        presentToday,
        absentToday,
        onLeaveToday,
        pendingLeaveRequests,
        newEmployeesThisMonth,
        recentLeaveRequests: recentLeaveRequests.map(lr => ({
          id: lr.id,
          employeeName: lr.employee ? `${lr.employee.firstName} ${lr.employee.lastName}` : 'Unknown',
          employeeCode: lr.employee?.employeeCode,
          department: lr.employee?.department,
          leaveType: lr.leaveType,
          startDate: lr.startDate,
          endDate: lr.endDate,
          numberOfDays: lr.numberOfDays,
          reason: lr.reason,
          status: lr.status,
          appliedOn: lr.createdAt
        })),
        recentEmployees: recentEmployees.map(e => ({
          id: e.id,
          employeeCode: e.employeeCode,
          name: `${e.firstName} ${e.lastName}`,
          department: e.department,
          designation: e.designation,
          dateOfJoining: e.dateOfJoining
        }))
      })
    );
  } catch (error: any) {
    console.error('Get admin stats error:', error);
    res.status(500).json(errorResponse('Failed to retrieve admin stats', 'GEN_003'));
  }
};

export const getEmployeeStats = async (req: AuthRequest, res: Response) => {
  try {
    const { Employee, Attendance, LeaveBalance, LeaveRequest } = req.app.locals.models;
    
    // Get employee from JWT token
    const employee = await Employee.findOne({ 
      where: { userId: req.user?.userId } 
    });
    
    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }
    
    // Get current date and month
    const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const firstDayOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
    
    // Check-in status for today
    const todayAttendance = await Attendance.findOne({
      where: { 
        employeeId: employee.id, 
        attendanceDate: today 
      }
    });
    
    const checkInStatus = {
      checkedIn: !!todayAttendance?.checkInTime,
      checkInTime: todayAttendance?.checkInTime || null,
      checkOutTime: todayAttendance?.checkOutTime || null,
      status: todayAttendance?.checkInTime 
        ? (parseInt(todayAttendance.checkInTime.split(':')[0]) > 9 || 
           (parseInt(todayAttendance.checkInTime.split(':')[0]) === 9 && 
            parseInt(todayAttendance.checkInTime.split(':')[1]) > 30)
          ? 'late' : 'on-time')
        : 'not-checked-in',
      date: today
    };
    
    // Monthly attendance summary
    const monthlyAttendance = await Attendance.findAll({
      where: {
        employeeId: employee.id,
        attendanceDate: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });
    
    const presentDays = monthlyAttendance.filter(a => a.status === 'present').length;
    const absentDays = monthlyAttendance.filter(a => a.status === 'absent').length;
    const leaveDays = monthlyAttendance.filter(a => a.status === 'leave').length;
    const totalDays = monthlyAttendance.length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    
    // Leave balance
    const leaveBalances = await LeaveBalance.findAll({
      where: {
        employeeId: employee.id,
        year: currentYear
      }
    });
    
    const paidLeave = leaveBalances.find(lb => lb.leaveType === 'paid');
    const sickLeave = leaveBalances.find(lb => lb.leaveType === 'sick');
    
    // Pending actions
    const pendingLeaveRequests = await LeaveRequest.count({
      where: {
        employeeId: employee.id,
        status: 'pending'
      }
    });
    
    // Check profile completion (simple calculation)
    const profileCompletion = employee.phone ? 100 : 85;
    
    // Recent attendance (last 7 days)
    const recentAttendance = await Attendance.findAll({
      where: { employeeId: employee.id },
      limit: 7,
      order: [['attendanceDate', 'DESC']]
    });
    
    // Recent leave requests (last 3)
    const recentLeaveRequests = await LeaveRequest.findAll({
      where: { employeeId: employee.id },
      limit: 3,
      order: [['createdAt', 'DESC']]
    });
    
    res.json(
      successResponse('Employee dashboard stats retrieved successfully', {
        checkInStatus,
        monthlyAttendance: {
          presentDays,
          absentDays,
          leaveDays,
          percentage
        },
        leaveBalance: {
          paid: {
            total: paidLeave?.totalAllocated || 0,
            used: paidLeave?.used || 0,
            remaining: paidLeave?.remaining || 0
          },
          sick: {
            total: sickLeave?.totalAllocated || 0,
            used: sickLeave?.used || 0,
            remaining: sickLeave?.remaining || 0
          }
        },
        pendingActions: {
          profileCompletion,
          pendingLeaveRequests,
          documentsNeeded: 0
        },
        recentAttendance: recentAttendance.map(a => ({
          date: a.attendanceDate,
          checkIn: a.checkInTime,
          checkOut: a.checkOutTime,
          workHours: a.workHours,
          status: a.status
        })),
        recentLeaveRequests: recentLeaveRequests.map(lr => ({
          id: lr.id,
          leaveType: lr.leaveType,
          startDate: lr.startDate,
          endDate: lr.endDate,
          numberOfDays: lr.numberOfDays,
          status: lr.status,
          appliedOn: lr.createdAt
        }))
      })
    );
  } catch (error: any) {
    console.error('Get employee stats error:', error);
    res.status(500).json(errorResponse('Failed to retrieve employee stats', 'GEN_003'));
  }
};
